
console.log('START')
//debugger
THREE = require('three');
require('three/examples/js/loaders/OBJLoader.js');


gsap = require('gsap/dist/gsap').default;
ScrollTrigger = require("../etc/ScrollTrigger.min.js").default;
DrawSVGPlugin = require("gsap/dist/DrawSVGPlugin").default;

//console.clear();

// there are 3 parts to this
//
// Scene:           Setups and manages threejs rendering
// loadModel:       Loads the 3d obj file
// setupAnimation:  Creates all the GSAP 
//                  animtions and scroll triggers 
//
// first we call loadModel, once complete we call
// setupAnimation which creates a new Scene

class Scene
{
	constructor(model)
	{
		this.views = [
			{ bottom: 0, height: 1 },
			{ bottom: 0, height: 0 }
		];
		
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild( this.renderer.domElement );
		
		// scene

		this.scene = new THREE.Scene();
		
		for ( var ii = 0; ii < this.views.length; ++ ii ) {

			var view = this.views[ ii ];
			var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
			camera.position.fromArray([0, 0, 180] );
			camera.layers.disableAll();
			camera.layers.enable( ii );
			view.camera = camera;
			camera.lookAt(new THREE.Vector3(0, 5, 0));
		}
		
		//light

		this.light = new THREE.PointLight( 0xffffff, 1.75 );
		this.light.position.z = 150;
		this.light.position.x = 70;
		this.light.position.y = -20;
		this.scene.add( this.light );

		this.softLight = new THREE.AmbientLight( 0xffffff, 1.5 );
		this.scene.add(this.softLight)

		// group

		this.onResize();
		window.addEventListener( 'resize', this.onResize, false );
		
		var edges = new THREE.EdgesGeometry( model.children[ 0 ].geometry );
		let line = new THREE.LineSegments( edges );
		line.material.depthTest = false;
		line.material.opacity = 0.5;
		line.material.transparent = true;
		line.position.x = 0.5;
		line.position.z = -1;
		line.position.y = 0.2;	
		
		this.modelGroup = new THREE.Group();
		
		model.layers.set( 0 );
		line.layers.set( 1 );
			
		this.modelGroup.add(model);
		this.modelGroup.add(line);
		this.scene.add(this.modelGroup);
	}
	
	render = () =>
	{
		for ( var ii = 0; ii < this.views.length; ++ ii ) {

			var view = this.views[ ii ];
			var camera = view.camera;

			var bottom = Math.floor( this.h * view.bottom );
			var height = Math.floor( this.h * view.height );

			this.renderer.setViewport( 0, 0, this.w, this.h );
			this.renderer.setScissor( 0, bottom, this.w, height );
			this.renderer.setScissorTest( true );

			camera.aspect = this.w / this.h;
			this.renderer.render( this.scene, camera );
		}
	}
	
	onResize = () => 
	{
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		
		for ( var ii = 0; ii < this.views.length; ++ ii ) {
			var view = this.views[ ii ];
			var camera = view.camera;
			camera.aspect = this.w / this.h;
			let camZ = (screen.width - (this.w * 1)) / 3;
			camera.position.z = camZ < 180 ? 180 : camZ;
			camera.updateProjectionMatrix();
		}

		this.renderer.setSize( this.w, this.h );		
		this.render();
	}
}

function loadModel() 
{
	gsap.registerPlugin(ScrollTrigger);
	gsap.registerPlugin(DrawSVGPlugin);
	gsap.set('#line-length', {drawSVG: 0})
	gsap.set('#line-wingspan', {drawSVG: 0})
	gsap.set('#circle-phalange', {drawSVG: 0})
	
	var object;

	function onModelLoaded() {
		object.traverse( function ( child ) {
			let mat = new THREE.MeshPhongMaterial( { color: 0x171511, specular: 0xD0CBC7, shininess: 5, flatShading: true } );
			child.material = mat;
		});

		setupAnimation(object);
	}

	var manager = new THREE.LoadingManager( onModelLoaded );
	manager.onProgress = ( item, loaded, total ) => console.log( item, loaded, total );

	var loader = new THREE.OBJLoader( manager );
	loader.load( 'https://assets.codepen.io/557388/1405+Plane_1.obj', function ( obj ) { object = obj; });
}

function setupAnimation(model)
{
	let scene = new Scene(model);
	let plane = scene.modelGroup;
	
	gsap.fromTo('canvas',{x: "50%", autoAlpha: 0},  {duration: 1, x: "0%", autoAlpha: 1});
	gsap.to('.loading', {autoAlpha: 0})
	gsap.to('.scroll-cta', {opacity: 1})
	gsap.set('svg', {autoAlpha: 1})
	
	let tau = Math.PI * 2;

	gsap.set(plane.rotation, {y: tau * -.25});
	gsap.set(plane.position, {x: 80, y: -32, z: -60});
	
	scene.render();
	
	var sectionDuration = 1;
	gsap.fromTo(scene.views[1], 
		{ 	height: 1, bottom: 0 }, 
		{
			height: 0, bottom: 1,
			ease: 'none',
			scrollTrigger: {
			  trigger: ".blueprint",
			  scrub: true,
			  start: "bottom bottom",
			  end: "bottom top"
			}
		})
	
	gsap.fromTo(scene.views[1], 
		{ 	height: 0, bottom: 0 }, 
		{
			height: 1, bottom: 0,
			ease: 'none',
			scrollTrigger: {
			  trigger: ".blueprint",
			  scrub: true,
			  start: "top bottom",
			  end: "top top"
			}
		})
	
	gsap.to('.ground', {
		y: "30%",
		scrollTrigger: {
		  trigger: ".ground-container",
		  scrub: true,
		  start: "top bottom",
		  end: "bottom top"
		}
	})
	
	gsap.from('.clouds', {
		y: "25%",
		scrollTrigger: {
		  trigger: ".ground-container",
		  scrub: true,
		  start: "top bottom",
		  end: "bottom top"
		}
	})
	
	gsap.to('#line-length', {
		drawSVG: 100,
		scrollTrigger: {
		  trigger: ".length",
		  scrub: true,
		  start: "top bottom",
		  end: "top top"
		}
	})
	
	gsap.to('#line-wingspan', {
		drawSVG: 100,
		scrollTrigger: {
		  trigger: ".wingspan",
		  scrub: true,
		  start: "top 25%",
		  end: "bottom 50%"
		}
	})	
	
	gsap.to('#circle-phalange', {
		drawSVG: 100,
		scrollTrigger: {
		  trigger: ".phalange",
		  scrub: true,
		  start: "top 50%",
		  end: "bottom 100%"
		}
	})
	
	gsap.to('#line-length', {
		opacity: 0,
		drawSVG: 0,
		scrollTrigger: {
		  trigger: ".length",
		  scrub: true,
		  start: "top top",
		  end: "bottom top"
		}
	})
	
	gsap.to('#line-wingspan', {
		opacity: 0,
		drawSVG: 0,
		scrollTrigger: {
		  trigger: ".wingspan",
		  scrub: true,
		  start: "top top",
		  end: "bottom top"
		}
	})	
	
	gsap.to('#circle-phalange', {
		opacity: 0,
		drawSVG: 0,
		scrollTrigger: {
		  trigger: ".phalange",
		  scrub: true,
		  start: "top top",
		  end: "bottom top"
		}
	})
	
	let tl = new gsap.timeline(
	{
		onUpdate: scene.render,
		scrollTrigger: {
		  trigger: ".content",
		  scrub: true,
		  start: "top top",
		  end: "bottom bottom"
		},
		defaults: {duration: sectionDuration, ease: 'power2.inOut'}
	});
	
	let delay = 0;
	
	tl.to('.scroll-cta', {duration: 0.25, opacity: 0}, delay)
	tl.to(plane.position, {x: -10, ease: 'power1.in'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * .25, y: 0, z: -tau * 0.05, ease: 'power1.inOut'}, delay)
	tl.to(plane.position, {x: -40, y: 0, z: -60, ease: 'power1.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * .25, y: 0,  z: tau * 0.05, ease: 'power3.inOut'}, delay)
	tl.to(plane.position, {x: 40, y: 0, z: -60, ease: 'power2.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * .2, y: 0, z: -tau * 0.1, ease: 'power3.inOut'}, delay)
	tl.to(plane.position, {x: -40, y: 0, z: -30, ease: 'power2.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, { x: 0, z: 0, y: tau * .25}, delay)
	tl.to(plane.position, { x: 0, y: -10, z: 50}, delay)
	
	delay += sectionDuration;
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * 0.25, y: tau *.5, z: 0, ease:'power4.inOut'}, delay)
	tl.to(plane.position, {z: 30, ease:'power4.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * 0.25, y: tau *.5, z: 0, ease:'power4.inOut'}, delay)
	tl.to(plane.position, {z: 60, x: 30, ease:'power4.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * 0.35, y: tau *.75, z: tau * 0.6, ease:'power4.inOut'}, delay)
	tl.to(plane.position, {z: 100, x: 20, y: 0, ease:'power4.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {x: tau * 0.15, y: tau *.85, z: -tau * 0, ease: 'power1.in'}, delay)
	tl.to(plane.position, {z: -150, x: 0, y: 0, ease: 'power1.inOut'}, delay)
	
	delay += sectionDuration;
	
	tl.to(plane.rotation, {duration: sectionDuration, x: -tau * 0.05, y: tau, z: -tau * 0.1, ease: 'none'}, delay)
	tl.to(plane.position, {duration: sectionDuration, x: 0, y: 30, z: 320, ease: 'power1.in'}, delay)
	
	tl.to(scene.light.position, {duration: sectionDuration, x: 0, y: 0, z: 0}, delay)
}

loadModel();











