import os, math
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

OUT = 'public/house/models/luxury-house-architectural.glb'
os.makedirs(os.path.dirname(OUT), exist_ok=True)

M = {
  'stone': PBRMaterial(name='Warm Limestone', baseColorFactor=[0.55,0.52,0.46,1], roughnessFactor=0.82, metallicFactor=0),
  'oak': PBRMaterial(name='Natural Oak', baseColorFactor=[0.38,0.21,0.10,1], roughnessFactor=0.62, metallicFactor=0),
  'dark': PBRMaterial(name='Charcoal Aluminum', baseColorFactor=[0.05,0.06,0.07,1], roughnessFactor=0.28, metallicFactor=0.72),
  'glass': PBRMaterial(name='Low Iron Glass', baseColorFactor=[0.16,0.28,0.30,0.42], roughnessFactor=0.08, metallicFactor=0, alphaMode='BLEND'),
  'concrete': PBRMaterial(name='Architectural Concrete', baseColorFactor=[0.22,0.23,0.22,1], roughnessFactor=0.92, metallicFactor=0),
  'fabric': PBRMaterial(name='Linen Upholstery', baseColorFactor=[0.74,0.70,0.62,1], roughnessFactor=0.95, metallicFactor=0),
  'marble': PBRMaterial(name='Calacatta Stone', baseColorFactor=[0.83,0.81,0.76,1], roughnessFactor=0.35, metallicFactor=0),
  'green': PBRMaterial(name='Landscape Green', baseColorFactor=[0.06,0.16,0.08,1], roughnessFactor=1, metallicFactor=0),
  'water': PBRMaterial(name='Pool Water', baseColorFactor=[0.04,0.20,0.23,0.55], roughnessFactor=0.08, metallicFactor=0, alphaMode='BLEND'),
  'white': PBRMaterial(name='Soft White', baseColorFactor=[0.90,0.89,0.86,1], roughnessFactor=0.72, metallicFactor=0),
}
scene = trimesh.Scene()

def box(name, size, loc, mat='stone', rot=None):
    m = trimesh.creation.box(extents=size)
    if rot: m.apply_transform(trimesh.transformations.euler_matrix(*rot))
    m.apply_translation(loc); m.visual.material = M[mat]
    scene.add_geometry(m, node_name=name)

def cyl(name, r, h, loc, mat='dark', n=20):
    m = trimesh.creation.cylinder(radius=r, height=h, sections=n)
    m.apply_translation(loc); m.visual.material = M[mat]
    scene.add_geometry(m, node_name=name)

# Site, pool and slabs
box('site',(22,16,.35),(0,0,-.18),'concrete'); box('pool',(10,3.2,.18),(3.2,-5.1,.05),'water')
box('pool-deck',(11,4,.20),(3.2,-4.7,.16),'stone'); box('ground-slab',(15,10,.30),(0,0,0),'stone')
box('upper-slab',(15,10,.30),(0,0,3.45),'concrete'); box('roof',(16,10.5,.38),(0,0,6.95),'dark')

# Two storeys
for z in [1.75,5.0]:
    box(f'wall-n-{z}',(15,.28,3.2),(0,4.86,z),'stone'); box(f'wall-s-{z}',(15,.28,3.2),(0,-4.86,z),'stone')
    box(f'wall-w-{z}',(.28,9.45,3.2),(-7.36,0,z),'stone'); box(f'wall-e-{z}',(.28,9.45,3.2),(7.36,0,z),'stone')
    for x in [-4.9,-1.6,1.7,4.8]: box('front-glazing',(2.7,.10,2.5),(x,-4.70,z),'glass')
    box('rear-glazing',(11.8,.10,2.5),(0,4.70,z),'glass')
for x in [-6.25,-3.55,-.85,1.85,4.55,6.25]: box('window-frame',(.06,.16,2.6),(x,-4.63,1.7),'dark'); box('window-frame',(.06,.16,2.6),(x,-4.63,4.95),'dark')

# Foyer and sculptural staircase
box('foyer-mat',(4,1.3,.18),(-2.3,1.0,.24),'marble')
for i in range(12): box(f'step-{i}',(.72,1.05,.16),(-4.3+i*.45,1.0+i*.18,.38+i*.24),'oak')
box('stair-stringer',(6,.18,.18),(-1.55,2.05,2.05),'dark',(0,math.radians(16),0))
for i in range(8): cyl('rail-post',.035,1.15,(-4.0+i*.7,1.56,1.1+i*.15),'dark',12)
box('rail-top',(5.3,.08,.08),(-1.55,1.56,2.25),'dark')

# Living
box('living-rug',(5,3.3,.08),(-2.2,-1.0,.38),'fabric'); box('sofa',(3.6,.92,.42),(-2.2,-2.35,.68),'fabric')
for x in [-3.75,-2.2,-.65]: box('sofa-back',(1.25,.35,1.0),(x,-2.83,1.12),'fabric')
box('coffee-table',(1.6,.8,.36),(-2.1,-.95,.76),'oak'); box('fireplace',(2.8,.45,2.3),(4.95,3.98,1.5),'dark')

# Dining
cyl('dining-top',1.55,.12,(2.7,1.0,.95),'oak',40); cyl('dining-leg',.15,1.0,(2.7,1.0,.48),'dark',20)
for a in np.linspace(0,2*math.pi,6,endpoint=False):
    x,y=2.7+2.05*math.cos(a),1.0+2.05*math.sin(a); cyl('chair-leg',.06,.75,(x,y,.38),'dark',12); box('chair-seat',(.55,.55,.16),(x*.96,y*.96,.72),'fabric')

# Kitchen
box('kitchen-run',(5,.55,.9),(1.7,3.45,.95),'oak'); box('kitchen-counter',(5.3,.85,.12),(1.7,3.12,1.46),'marble')
box('island',(3.4,1.2,.88),(.8,2.25,1.02),'oak'); box('island-top',(3.65,1.35,.14),(.8,2.25,1.54),'marble')
for x in [-.1,.8,1.7]: cyl('pendant',.16,.8,(x,2.25,2.9),'dark'); cyl('pendant-glow',.10,.18,(x,2.25,2.48),'white',16)

# Upstairs bedrooms / suite furniture
for cx,cy in [(-3.6,1.9),(3.5,1.9),(0,-2.2)]:
    box('bed-rug',(3.5,3.1,.08),(cx,cy,3.64),'fabric'); box('bed-frame',(2.2,2.5,.28),(cx,cy,3.88),'oak')
    box('mattress',(2.0,2.25,.35),(cx,cy,4.12),'white'); box('headboard',(2.1,.15,1.4),(cx,cy+1.05,4.58),'fabric')
    for sx in [-1.25,1.25]: box('nightstand',(.45,.5,.55),(cx+sx,cy+1.55,4.0),'oak'); cyl('lamp',.14,.25,(cx+sx,cy+1.55,4.42),'white',16)
box('upper-rug',(4.6,2.6,.08),(0,.8,3.66),'fabric'); box('upper-sofa',(2.8,.85,.42),(0,1.0,4.0),'fabric'); box('upper-console',(2.4,.45,.9),(0,3.9,4.15),'oak')

# Bath / terrace
box('bath-floor',(4,2.8,.08),(5.05,-2.1,3.64),'marble'); box('bath-vanity',(2.6,.5,.9),(5.0,-3.1,4.1),'oak'); box('bath-top',(2.8,.65,.12),(5.0,-3.1,4.58),'marble'); box('tub',(1.7,.8,.55),(4,-1.1,3.95),'white')
box('terrace-floor',(14,2.2,.12),(0,-5.8,3.60),'stone')
for x in [-5,-2,1,4]: box('pergola-post',(.18,.18,2.7),(x,-6.2,4.95),'dark')
for x in [-3.5,-.5,2.5]: box('pergola-beam',(2.8,.18,.18),(x,-6.2,6.25),'dark')
box('outdoor-sofa',(3.2,.8,.45),(-2.4,-6.2,4.05),'fabric'); box('outdoor-table',(1.2,.7,.32),(1.5,-6.1,4.15),'dark')

# Landscape
for x,y in [(-8,-7),(-7,6),(-3,7),(8,6),(8,-7),(-8,2),(7,2)]:
    cyl('planter',.55,.5,(x,y,.35),'concrete'); cyl('trunk',.10,1.7,(x,y,1.2),'oak'); cyl('tree-crown',.85,.8,(x,y,2.05),'green',24)

scene.export(OUT, file_type='glb')
print(f'created {OUT} with {len(scene.geometry)} meshes')
