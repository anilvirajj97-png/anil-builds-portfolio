"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Raycaster,
  RingGeometry,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

export type SceneController = {
  reset: () => void;
  nudge: (direction: -1 | 1) => void;
};

type SceneProject = { id: string; name: string };

type OrbSceneProps = {
  projects: SceneProject[];
  selectedId: string;
  paused: boolean;
  onSelect: (id: string) => void;
  onReady: (controller: SceneController) => void;
  onError: () => void;
};

const ORBITS = [
  { radius: 2.7, tilt: 0.35, spin: 0.1, speed: 0.34, phase: 0.6 },
  { radius: 3.3, tilt: -0.5, spin: 0.9, speed: 0.27, phase: 2.3 },
  { radius: 3.9, tilt: 0.75, spin: -0.4, speed: 0.21, phase: 4.0 },
  { radius: 4.4, tilt: -0.25, spin: 1.6, speed: 0.17, phase: 5.4 },
];

const BASE_PITCH = 0.2;
const MAX_PITCH = 0.6;
const FOV = 38;
const FIT_RADIUS = 5.1;

type NodeState = {
  id: string;
  orbit: Group;
  mesh: Mesh;
  ring: Mesh;
  config: (typeof ORBITS)[number];
};

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2d context unavailable");
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(150, 190, 255, 0.95)");
  gradient.addColorStop(0.35, "rgba(70, 120, 255, 0.4)");
  gradient.addColorStop(1, "rgba(30, 60, 200, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export default function OrbScene({
  projects,
  selectedId,
  paused,
  onSelect,
  onReady,
  onError,
}: OrbSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const live = useRef({ paused, selectedId, onSelect, onReady, onError });
  const invalidate = useRef<() => void>(() => {});

  useEffect(() => {
    live.current = { ...live.current, paused, selectedId, onSelect, onReady, onError };
    invalidate.current();
  }, [paused, selectedId, onSelect, onReady, onError]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      live.current.onError();
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "pan-y";
    canvas.style.cursor = "grab";
    container.prepend(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
    const world = new Group();
    scene.add(world);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const ice = new Color(0xa9cdff);
    const cobalt = new Color(0x3b6cff);

    const coreGeometry = track(new IcosahedronGeometry(1.25, 3));
    const coreMaterial = track(
      new MeshStandardMaterial({
        color: 0x16318f,
        emissive: cobalt,
        emissiveIntensity: 0.85,
        roughness: 0.35,
        metalness: 0.25,
      }),
    );
    const core = new Mesh(coreGeometry, coreMaterial);
    world.add(core);

    const latticeGeometry = track(new IcosahedronGeometry(1.58, 1));
    const latticeMaterial = track(
      new MeshBasicMaterial({ color: ice, wireframe: true, transparent: true, opacity: 0.32 }),
    );
    const lattice = new Mesh(latticeGeometry, latticeMaterial);
    world.add(lattice);

    const glowTexture = track(createGlowTexture());
    const glowMaterial = track(
      new SpriteMaterial({
        map: glowTexture,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    );
    const glow = new Sprite(glowMaterial);
    glow.scale.set(7, 7, 1);
    world.add(glow);

    const ringGeometryCache = new Map<number, TorusGeometry>();
    const nodeGeometry = track(new SphereGeometry(0.26, 20, 14));
    const hitGeometry = track(new SphereGeometry(0.62, 8, 6));
    const hitMaterial = track(new MeshBasicMaterial({ visible: false }));
    const selectionGeometry = track(new RingGeometry(0.4, 0.46, 40));

    const nodes: NodeState[] = projects.map((project, index) => {
      const config = ORBITS[index % ORBITS.length];
      const orbit = new Group();
      orbit.rotation.set(config.tilt, 0, config.spin);

      let trackGeometry = ringGeometryCache.get(config.radius);
      if (!trackGeometry) {
        trackGeometry = track(new TorusGeometry(config.radius, 0.007, 6, 120));
        ringGeometryCache.set(config.radius, trackGeometry);
      }
      const trackMaterial = track(
        new MeshBasicMaterial({ color: ice, transparent: true, opacity: 0.26 }),
      );
      const track3d = new Mesh(trackGeometry, trackMaterial);
      track3d.rotation.x = Math.PI / 2;
      orbit.add(track3d);

      const material = track(
        new MeshStandardMaterial({
          color: 0xf6f1e4,
          emissive: ice,
          emissiveIntensity: 0.55,
          roughness: 0.3,
          metalness: 0.1,
        }),
      );
      const mesh = new Mesh(nodeGeometry, material);
      mesh.userData.id = project.id;

      const hit = new Mesh(hitGeometry, hitMaterial);
      hit.userData.id = project.id;
      mesh.add(hit);

      const selectionMaterial = track(
        new MeshBasicMaterial({ color: ice, side: DoubleSide, transparent: true, opacity: 0.9 }),
      );
      const ring = new Mesh(selectionGeometry, selectionMaterial);
      ring.visible = false;
      mesh.add(ring);

      orbit.add(mesh);
      world.add(orbit);
      return { id: project.id, orbit, mesh, ring, config };
    });
    const hitMeshes = nodes.map((node) => node.mesh.children[0] as Mesh);

    const starCount = 180;
    const starPositions: number[] = [];
    for (let i = 0; i < starCount; i += 1) {
      const radius = 6.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.7,
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
    const starGeometry = track(new BufferGeometry());
    starGeometry.setAttribute("position", new Float32BufferAttribute(starPositions, 3));
    const starMaterial = track(
      new PointsMaterial({ color: ice, size: 0.045, transparent: true, opacity: 0.7, sizeAttenuation: true }),
    );
    world.add(new Points(starGeometry, starMaterial));

    scene.add(new AmbientLight(0x8fb2ff, 0.7));
    const cobaltLight = new PointLight(0x5b8cff, 70, 24);
    cobaltLight.position.set(4, 3, 5);
    scene.add(cobaltLight);
    const warmLight = new PointLight(0xfff1d6, 35, 24);
    warmLight.position.set(-5, -2, 6);
    scene.add(warmLight);
    const rim = new DirectionalLight(0xa9cdff, 0.8);
    rim.position.set(-2, 4, -4);
    scene.add(rim);

    let width = 1;
    let height = 1;
    let yaw = -0.35;
    let pitch = BASE_PITCH;
    let targetYaw = yaw;
    let targetPitch = BASE_PITCH;
    let time = 0;
    let dirty = true;
    let inView = true;
    let raf = 0;
    let last = performance.now();
    let hoveredId: string | null = null;
    let disposed = false;

    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const worldPosition = new Vector3();
    const projected = new Vector3();

    const pick = (clientX: number, clientY: number): string | null => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(hitMeshes, false)[0];
      return hit ? (hit.object.userData.id as string) : null;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const halfFov = Math.tan((FOV * Math.PI) / 360);
      const fitHorizontal = FIT_RADIUS / (halfFov * camera.aspect);
      const fitVertical = FIT_RADIUS / halfFov;
      camera.position.set(0, 0.8, Math.max(10.5, Math.min(fitHorizontal, fitVertical)));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      dirty = true;
    };

    const updateLabels = () => {
      for (const node of nodes) {
        const label = labelRefs.current[node.id];
        if (!label) continue;
        node.mesh.getWorldPosition(worldPosition);
        const distance = camera.position.distanceTo(worldPosition);
        projected.copy(worldPosition).project(camera);
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        const depth = Math.min(1, Math.max(0, (camera.position.z + 2.5 - distance) / 5 + 0.5));
        label.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + 24).toFixed(1)}px, 0) translateX(-50%)`;
        label.style.opacity = (0.45 + 0.55 * depth).toFixed(2);
      }
    };

    const render = () => {
      renderer.render(scene, camera);
      updateLabels();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!inView || document.hidden) return;

      try {
        const running = !live.current.paused;
        const selected = live.current.selectedId;

        let scaling = false;
        for (const node of nodes) {
          const target = node.id === selected ? 1.45 : node.id === hoveredId ? 1.2 : 1;
          const next = node.mesh.scale.x + (target - node.mesh.scale.x) * (1 - Math.exp(-dt * 10));
          if (Math.abs(next - target) > 0.002) scaling = true;
          node.mesh.scale.setScalar(Math.abs(next - target) > 0.002 ? next : target);
          node.ring.visible = node.id === selected;
        }

        if (running && !dragging) targetYaw += dt * 0.1;
        const ease = 1 - Math.exp(-dt * 8);
        yaw += (targetYaw - yaw) * ease;
        pitch += (targetPitch - pitch) * ease;
        const settling =
          Math.abs(targetYaw - yaw) > 0.0005 || Math.abs(targetPitch - pitch) > 0.0005;

        if (!running && !settling && !scaling && !dirty) return;
        dirty = false;

        if (running) time += dt;
        world.rotation.set(pitch, yaw, 0);
        lattice.rotation.y = time * 0.15;
        lattice.rotation.x = time * 0.08;
        core.rotation.y = -time * 0.1;
        glowMaterial.opacity = 0.78 + Math.sin(time * 0.9) * 0.07;

        for (const node of nodes) {
          const angle = node.config.phase + time * node.config.speed;
          node.mesh.position.set(
            Math.cos(angle) * node.config.radius,
            0,
            Math.sin(angle) * node.config.radius,
          );
          if (node.ring.visible) node.ring.lookAt(camera.position);
        }

        render();
      } catch {
        cancelAnimationFrame(raf);
        live.current.onError();
      }
    };

    let dragging: {
      pointerId: number;
      x: number;
      y: number;
      startX: number;
      startY: number;
      moved: boolean;
    } | null = null;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
      if (event.pointerType === "mouse") {
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = "grabbing";
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || dragging.pointerId !== event.pointerId) {
        if (event.pointerType === "mouse") {
          const id = pick(event.clientX, event.clientY);
          if (id !== hoveredId) {
            hoveredId = id;
            canvas.style.cursor = id ? "pointer" : "grab";
            dirty = true;
          }
        }
        return;
      }
      const dx = event.clientX - dragging.x;
      const dy = event.clientY - dragging.y;
      dragging.x = event.clientX;
      dragging.y = event.clientY;
      if (
        !dragging.moved &&
        Math.hypot(event.clientX - dragging.startX, event.clientY - dragging.startY) > 6
      ) {
        dragging.moved = true;
      }
      if (dragging.moved) {
        targetYaw += dx * 0.008;
        if (event.pointerType === "mouse") {
          targetPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, targetPitch + dy * 0.006));
        }
      }
    };

    const endDrag = (event: PointerEvent, allowSelect: boolean) => {
      if (!dragging || dragging.pointerId !== event.pointerId) return;
      const wasTap = !dragging.moved;
      dragging = null;
      canvas.style.cursor = hoveredId ? "pointer" : "grab";
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (allowSelect && wasTap) {
        const id = pick(event.clientX, event.clientY);
        if (id) live.current.onSelect(id);
      }
    };

    const onPointerUp = (event: PointerEvent) => endDrag(event, true);
    const onPointerCancel = (event: PointerEvent) => endDrag(event, false);
    const onPointerLeave = () => {
      if (hoveredId) {
        hoveredId = null;
        canvas.style.cursor = "grab";
        dirty = true;
      }
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      live.current.onError();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) dirty = true;
    });
    intersectionObserver.observe(container);

    invalidate.current = () => {
      dirty = true;
    };

    const controller: SceneController = {
      reset: () => {
        yaw = ((((yaw + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
        targetYaw = -0.35;
        targetPitch = BASE_PITCH;
        dirty = true;
      },
      nudge: (direction) => {
        targetYaw += direction * 0.5;
        dirty = true;
      },
    };

    try {
      resize();
      world.rotation.set(pitch, yaw, 0);
      for (const node of nodes) {
        const angle = node.config.phase;
        node.mesh.position.set(
          Math.cos(angle) * node.config.radius,
          0,
          Math.sin(angle) * node.config.radius,
        );
      }
      render();
      dirty = false;
      raf = requestAnimationFrame(frame);
      live.current.onReady(controller);
    } catch {
      live.current.onError();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      invalidate.current = () => {};
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      for (const item of disposables) item.dispose();
      scene.traverse((object) => {
        const material = (object as Mesh).material as Material | Material[] | undefined;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      void disposed;
    };
    // The scene is built once; props flow through the `live` ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {projects.map((project) => (
          <span
            key={project.id}
            ref={(element) => {
              labelRefs.current[project.id] = element;
            }}
            className={`absolute left-0 top-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold will-change-transform sm:text-sm ${
              project.id === selectedId
                ? "border-ice bg-ice text-midnight"
                : "border-ice/30 bg-midnight/70 text-ivory"
            }`}
            style={{ opacity: 0 }}
          >
            {project.name}
          </span>
        ))}
      </div>
    </div>
  );
}
