r"""Build the production MAGNUM poker chip GLB with Blender.

Run from the repository root:
  "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python scripts/build-magnum-chip.py

The source model is never modified. The script imports it, materializes the
MAGNUM finish and writes the production GLB plus an editable .blend scene.
"""

from math import pi
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[1]
BASE_MODEL = ROOT / "public" / "models" / "magnum-chip-base.glb"
FACE_TEXTURE = ROOT / "public" / "textures" / "magnum-chip-face.webp"
OUTPUT_MODEL = ROOT / "public" / "models" / "magnum-chip.glb"
OUTPUT_BLEND = ROOT / "assets" / "blender" / "magnum-chip.blend"


def reset_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.materials, bpy.data.images, bpy.data.curves):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def make_pbr_material(name: str, color: tuple[float, float, float, float], metallic: float, roughness: float) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return material


def make_face_material() -> bpy.types.Material:
    material = bpy.data.materials.new("MAGNUM Face — Burgundy + Ornamental Pike")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    image_node = nodes.new("ShaderNodeTexImage")
    image_node.image = bpy.data.images.load(str(FACE_TEXTURE), check_existing=True)
    image_node.interpolation = "Linear"
    links.new(image_node.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(image_node.outputs["Alpha"], bsdf.inputs["Alpha"])
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = 0.32
    if hasattr(material, "surface_render_method"):
        material.surface_render_method = "DITHERED"
    return material


def assign_material(obj: bpy.types.Object, material: bpy.types.Material) -> None:
    obj.data.materials.clear()
    obj.data.materials.append(material)


def add_disc(name: str, side: float, radius: float, depth: float, material: bpy.types.Material) -> bpy.types.Object:
    # The imported chip lies in the XZ plane and uses Y for thickness.
    # +π/2 produces the front (negative Y); -π/2 produces the back.
    rotation = (side * pi / 2, 0, 0)
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=128,
        radius=radius,
        depth=depth,
        location=(0, side * 0.105, 0),
        rotation=rotation,
    )
    disc = bpy.context.active_object
    disc.name = name
    assign_material(disc, material)
    bevel = disc.modifiers.new("Micro bevel", "BEVEL")
    bevel.width = 0.012
    bevel.segments = 3
    return disc


def main() -> None:
    if not BASE_MODEL.exists():
        raise FileNotFoundError(f"Missing base model: {BASE_MODEL}")
    if not FACE_TEXTURE.exists():
        raise FileNotFoundError(f"Missing face texture: {FACE_TEXTURE}")

    OUTPUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(BASE_MODEL))

    imported_meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not imported_meshes:
        raise RuntimeError("The base GLB did not contain mesh geometry.")

    for obj in imported_meshes:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
        obj.select_set(False)

    body = make_pbr_material("MAGNUM Body — Burgundy Ceramic", (0.205, 0.004, 0.022, 1.0), 0.04, 0.30)
    champagne = make_pbr_material("MAGNUM Edge — Champagne Composite", (0.665, 0.565, 0.408, 1.0), 0.58, 0.23)
    burgundy_inlay = make_pbr_material("MAGNUM Rim — Burgundy Inserts", (0.285, 0.006, 0.032, 1.0), 0.08, 0.27)
    center = make_pbr_material("MAGNUM Center — Deep Burgundy", (0.125, 0.003, 0.015, 1.0), 0.03, 0.26)
    face = make_face_material()

    # The base geometry contains a ceramic body and a separate ring mesh.
    for obj in imported_meshes:
        if obj.name.startswith("Chip_1"):
            assign_material(obj, champagne)
        else:
            assign_material(obj, body)

    # Central finish: a burgundy carrier disc and a near-flush alpha face texture
    # on each side. This avoids any white rectangle or z-fighting.
    for side, label in ((1.0, "Back"), (-1.0, "Front")):
        add_disc(f"MAGNUM Center {label}", side, 0.735, 0.010, center)
        decal = add_disc(f"MAGNUM Face {label}", side, 0.695, 0.002, face)
        decal.location.y = side * 0.111

    # Add the physical burgundy rim inserts over the champagne ring. The source
    # model already provides the beveled outer ring; these thin inlays preserve
    # its thickness while matching the MAGNUM SVG distribution.
    for index in range(10):
        angle = index * (2 * pi / 10)
        bpy.ops.mesh.primitive_cube_add(location=(0.88 * __import__("math").cos(angle), 0, 0.88 * __import__("math").sin(angle)))
        inset = bpy.context.active_object
        inset.name = f"MAGNUM Rim Inlay {index + 1:02d}"
        inset.dimensions = (0.20, 0.204, 0.075)
        inset.rotation_euler = (0, -angle, 0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        assign_material(inset, burgundy_inlay)
        bevel = inset.modifiers.new("Soft edge", "BEVEL")
        bevel.width = 0.012
        bevel.segments = 2

    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))

    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.select_set(True)

    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_MODEL),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_materials="EXPORT",
    )
    print(f"Wrote {OUTPUT_MODEL}")
    print(f"Wrote {OUTPUT_BLEND}")


if __name__ == "__main__":
    main()