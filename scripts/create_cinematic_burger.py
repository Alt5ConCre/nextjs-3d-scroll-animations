import bpy, math, os, random
from mathutils import Vector

# Cinematic Burger Generator
# Blender 5.x — builds a high-detail, animation-ready burger and exports GLB.
# Run:
# blender --background --python scripts/create_cinematic_burger.py
#
# Outputs:
#   public/assets/burger_cinematic.glb
#   public/assets/burger_cinematic_preview.png

SEED = 42
random.seed(SEED)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, "public", "assets")
os.makedirs(OUT_DIR, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1920
scene.render.resolution_percentage = 70
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = False
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = os.path.join(OUT_DIR, "burger_cinematic_preview.png")
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 120

scene.world.color = (0.006, 0.004, 0.003)

# ---------- helpers ----------
def mat(name, color, rough=.5, spec=.35, metallic=0.0, subsurface=0.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bs = m.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value = (*color, 1)
    bs.inputs["Roughness"].default_value = rough
    bs.inputs["Metallic"].default_value = metallic
    if "Specular IOR Level" in bs.inputs:
        bs.inputs["Specular IOR Level"].default_value = spec
    if "Subsurface Weight" in bs.inputs:
        bs.inputs["Subsurface Weight"].default_value = subsurface
    return m

def add_uv(name, loc, scale, material, seg=96, rings=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    bev=o.modifiers.new("Micro bevel","BEVEL"); bev.width=.008; bev.segments=3
    return o

def add_cyl(name, loc, radius, depth, material, verts=96):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc)
    o=bpy.context.object; o.name=name; o.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    bev=o.modifiers.new("Soft edge","BEVEL"); bev.width=.025; bev.segments=4
    return o

def add_torus(name, loc, major, minor, material, rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=96, minor_segments=24, location=loc, rotation=rot)
    o=bpy.context.object; o.name=name; o.data.materials.append(material); bpy.ops.object.shade_smooth()
    return o

def add_curve_blob(name, points, bevel, material):
    cu=bpy.data.curves.new(name,"CURVE"); cu.dimensions="3D"; cu.resolution_u=3
    sp=cu.splines.new("BEZIER"); sp.bezier_points.add(len(points)-1)
    for p,co in zip(sp.bezier_points,points):
        p.co=co; p.handle_left_type="AUTO"; p.handle_right_type="AUTO"
    cu.bevel_depth=bevel; cu.bevel_resolution=5
    o=bpy.data.objects.new(name,cu); bpy.context.collection.objects.link(o); o.data.materials.append(material)
    return o

def noise_material(m, scale=5.0, detail=3.0, bump=.12):
    nt=m.node_tree; n=nt.nodes; l=nt.links
    bs=n.get("Principled BSDF")
    tex=n.new("ShaderNodeTexNoise"); tex.inputs["Scale"].default_value=scale; tex.inputs["Detail"].default_value=detail; tex.inputs["Roughness"].default_value=.75
    bumpn=n.new("ShaderNodeBump"); bumpn.inputs["Strength"].default_value=bump; bumpn.inputs["Distance"].default_value=.06
    l.new(tex.outputs["Fac"], bumpn.inputs["Height"]); l.new(bumpn.outputs["Normal"], bs.inputs["Normal"])
    return m

# ---------- materials ----------
bun = noise_material(mat("Toasted Brioche", (0.62,.22,.045), .48,.4,0), 13, 5, .18)
bun_top = noise_material(mat("Golden Brioche", (.88,.43,.09), .43,.42,0), 11, 5, .22)
patty = noise_material(mat("Charred Beef", (.055,.018,.009), .72,.3,0), 18, 7, .28)
cheese = mat("Melted Cheddar", (1.0,.42,.035), .28,.5,0)
lettuce = noise_material(mat("Crisp Lettuce", (.055,.32,.035), .7,.25,0), 16, 4, .18)
tomato = mat("Tomato", (.72,.035,.018), .32,.45,0, .08)
onion = mat("Red Onion", (.42,.035,.16), .3,.5,0, .08)
sauce = mat("Glossy Sauce", (.28,.008,.004), .22,.6,0)
sesame = mat("Sesame", (.92,.72,.38), .52,.3,0)
paper = mat("Dark Food Paper", (.018,.014,.011), .82,.15,0)
metal = mat("Tray", (.035,.032,.028), .3,.7,.35)

# ---------- burger collection ----------
col=bpy.data.collections.new("CINEMATIC_BURGER"); scene.collection.children.link(col)
# unlink helper: objects are initially in main collection; move to burger collection
def move_to(o):
    for c in list(o.users_collection): c.objects.unlink(o)
    col.objects.link(o)
    return o

parts=[]

# lower bun
o=add_uv("01_LOWER_BUN",(0,0.05,0),(2.25,.48,2.25),bun,96,48); move_to(o); parts.append((o,0.05))

# patty, slightly irregular via proportional scaling
o=add_uv("02_PATTY",(0,.62,0),(2.08,.38,2.08),patty,96,48); move_to(o); parts.append((o,.62))
o.scale.z=1.01

# cheese sheet with drooping corners
verts=[]
faces=[]
N=48
for i in range(N):
    a=2*math.pi*i/N
    r=1.98
    x=math.cos(a)*r; z=math.sin(a)*r
    y=.98 + .10*math.sin(4*a) - .16*max(0, math.sin(a*2.0))
    verts.append((x,y,z))
for i in range(N): verts.append((math.cos(2*math.pi*i/N)*r,1.00,math.sin(2*math.pi*i/N)*r))
for i in range(N): faces.append((i,(i+1)%N,N+(i+1)%N,N+i))
me=bpy.data.meshes.new("MeltedCheeseMesh"); me.from_pydata(verts,[],faces); me.update()
o=bpy.data.objects.new("03_MELTED_CHEESE",me); col.objects.link(o); o.data.materials.append(cheese)
sol=o.modifiers.new("Cheese thickness","SOLIDIFY"); sol.thickness=.035
sub=o.modifiers.new("Cheese smooth","SUBSURF"); sub.levels=2; sub.render_levels=2
parts.append((o,1.0))

# lettuce ruffles
for j in range(3):
    pts=[]
    zoff=-.04+j*.035
    for i in range(26):
        a=2*math.pi*i/25
        r=1.86+.15*math.sin(i*2.4+j)
        pts.append((math.cos(a)*r,1.10+zoff+.035*math.sin(i*3.1),math.sin(a)*r))
    o=add_curve_blob(f"04_LETTUCE_{j+1}",pts,.075,lettuce); move_to(o); parts.append((o,1.10+zoff))

# tomato slices
for j,a in enumerate([.2,2.25,4.25]):
    x=1.25*math.cos(a); z=1.25*math.sin(a)
    o=add_cyl(f"05_TOMATO_{j+1}",(x,1.25,z),.53,.12,tomato,72); o.rotation_euler=(random.uniform(-.08,.08),random.uniform(-.08,.08),a); move_to(o); parts.append((o,1.25))

# onion rings
for j,a in enumerate([.7,2.6,4.7]):
    x=1.0*math.cos(a); z=1.0*math.sin(a)
    o=add_torus(f"06_ONION_{j+1}",(x,1.40,z),.42,.055,onion,(0,random.uniform(-.12,.12),random.uniform(-.1,.1))); move_to(o); parts.append((o,1.40))

# upper bun dome
o=add_uv("07_TOP_BUN",(0,1.83,0),(2.30,.86,2.30),bun_top,112,64); move_to(o); parts.append((o,1.83))
# flatten lower half of top bun
for v in o.data.vertices:
    if v.co.y < 0: v.co.y *= .35

# sesame seeds — hundreds of individual high-detail objects
for i in range(95):
    a=random.random()*2*math.pi
    r=(random.random()**.5)*1.72
    x=r*math.cos(a); z=r*math.sin(a)
    y=2.53 + .22*(1-(r/1.75)**2) + random.uniform(-.035,.035)
    s=add_uv(f"08_SESAME_{i:03d}",(x,y,z),(.065,.025,.035),sesame,24,12)
    s.rotation_euler=(random.random()*2,random.random()*2,random.random()*2); move_to(s); parts.append((s,2.53))

# sauce drips
for j,x in enumerate([-1.0,-.55,.62,1.05]):
    pts=[(x,1.10,1.83),(x+.08,1.04,1.90),(x+.05,.83,1.94)]
    o=add_curve_blob(f"09_SAUCE_DRIP_{j}",pts,.045,sauce); move_to(o); parts.append((o,1.10))

# tray + paper
bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=3.15,depth=.18,location=(0,-.62,0))
tray=bpy.context.object; tray.name="TRAY"; tray.data.materials.append(metal); move_to(tray)
bev=tray.modifiers.new("Tray bevel","BEVEL"); bev.width=.16; bev.segments=5

bpy.ops.mesh.primitive_plane_add(size=5.8,location=(0,-.49,0))
p=bpy.context.object; p.name="PAPER"; p.data.materials.append(paper); move_to(p)
sol=p.modifiers.new("Paper thickness","SOLIDIFY"); sol.thickness=.018

# ---------- cinematic ground ----------
bpy.ops.mesh.primitive_plane_add(size=30,location=(0,-.72,0))
ground=bpy.context.object; ground.name="GROUND"; ground.data.materials.append(paper)

# ---------- camera ----------
bpy.ops.object.camera_add(location=(0,2.05,7.2))
cam=bpy.context.object; cam.name="CINEMATIC_CAMERA"; scene.camera=cam
cam.data.lens=58

def look_at(obj, target):
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat("-Z","Y").to_euler()
look_at(cam,(0,1.05,0))

# ---------- lights ----------
def area(name,loc,energy,size,color):
    bpy.ops.object.light_add(type="AREA",location=loc)
    l=bpy.context.object; l.name=name; l.data.energy=energy; l.data.shape="DISK"; l.data.size=size; l.data.color=color
    look_at(l,(0,1.1,0)); return l

area("KEY",(4.5,5.5,5.0),950,4.0,(1.0,.64,.38))
area("RIM",(-4.5,3.5,1.5),1250,3.0,(.35,.48,1.0))
area("TOP",(0,6,-1),700,3.0,(1.0,.32,.12))
area("FRONT",(0,1.8,5.5),500,3.0,(1.0,.55,.3))

# ---------- animation ----------
# Whole burger gently rotates; individual layers separate and reassemble.
for o,base_y in parts:
    o.keyframe_insert("location",frame=1,index=1)
    o.keyframe_insert("rotation_euler",frame=1,index=2)
    spread=random.uniform(.35,.9)
    side=random.uniform(-.18,.18)
    o.location.y += spread
    o.location.x += side
    o.rotation_euler.z += random.uniform(-.10,.10)
    o.keyframe_insert("location",frame=55,index=1)
    o.keyframe_insert("rotation_euler",frame=55,index=2)
    o.location.y -= spread
    o.location.x -= side
    o.rotation_euler.z -= random.uniform(-.10,.10)
    o.keyframe_insert("location",frame=105,index=1)
    o.keyframe_insert("rotation_euler",frame=105,index=2)
    if o.animation_data and o.animation_data.action:
        for fc in o.animation_data.action.fcurves:
            for kp in fc.keyframe_points: kp.interpolation="BEZIER"

cam.keyframe_insert("location",frame=1)
cam.location=(2.2,2.35,6.2); look_at(cam,(0,1.15,0)); cam.keyframe_insert("location",frame=55)
cam.location=(-1.6,2.0,6.0); look_at(cam,(0,1.1,0)); cam.keyframe_insert("location",frame=105)
cam.location=(0,2.05,7.2); look_at(cam,(0,1.05,0)); cam.keyframe_insert("location",frame=120)
if cam.animation_data and cam.animation_data.action:
    for fc in cam.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation="BEZIER"

# Color management
scene.view_settings.look = "AgX - Medium High Contrast"

# ---------- render preview ----------
scene.frame_set(1)
bpy.ops.render.render(write_still=True)

# ---------- export ----------
for o in scene.objects:
    o.select_set(False)
for o in col.objects:
    o.select_set(True)
bpy.context.view_layer.objects.active = col.objects[0] if col.objects else None

glb=os.path.join(OUT_DIR,"burger_cinematic.glb")
bpy.ops.export_scene.gltf(filepath=glb,export_format="GLB",use_selection=False,export_animations=True,export_materials="EXPORT",export_apply=True)

# Save source blend beside generated assets for local editing.
blend=os.path.join(OUT_DIR,"burger_cinematic_source.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend)
print("CINEMATIC BURGER READY:", glb)
print("PREVIEW:", scene.render.filepath)
