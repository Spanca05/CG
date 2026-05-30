import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyCylinder } from "../../tps/MyCylinder.js"; 

export class MyDropZone extends CGFobject {
  constructor(scene, radius = 4.0) {
    super(scene);
    this.radius = radius;
    this.slices = 30; 

    
    this.border = new MyCylinder(scene, this.slices, 1);

    this.initMaterials();
    this.initCircle(); 

    
    this.isIntersecting = false;
  }

  initCircle() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

   
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    const alpha = (2 * Math.PI) / this.slices;
    
    // Gera os vértices da borda
    for (let i = 0; i <= this.slices; i++) {
      const angle = i * alpha;
      this.vertices.push(Math.cos(angle), 0, Math.sin(angle));
      this.normals.push(0, 1, 0); // Olha para cima (Eixo Y)
      this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 - 0.5 * Math.sin(angle));
    }

    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i, i + 1);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  initMaterials() {
    // 1. Material Base do Chão (Podes associar uma textura de terra aqui depois)
    this.floorApp = new CGFappearance(this.scene);
    this.floorApp.setAmbient(0.4, 0.4, 0.3, 1.0);
    this.floorApp.setDiffuse(0.6, 0.5, 0.4, 1.0);
    this.floorApp.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.floorApp.setShininess(5);

    // 2. Feedback Visual - ESTADO NORMAL (Laranja Suave / Madeira)
    this.borderNormal = new CGFappearance(this.scene);
    this.borderNormal.setAmbient(0.8, 0.4, 0.1, 1.0);
    this.borderNormal.setDiffuse(0.9, 0.5, 0.1, 1.0);
    this.borderNormal.setSpecular(0.2, 0.2, 0.2, 1.0);
    this.borderNormal.setShininess(10);

    // 3. Feedback Visual - ESTADO ATIVO/INTERSEÇÃO (Verde "Neon" a indicar que pode largar)
    this.borderActive = new CGFappearance(this.scene);
    this.borderActive.setAmbient(0.2, 0.9, 0.2, 1.0);
    this.borderActive.setDiffuse(0.3, 1.0, 0.3, 1.0);
    this.borderActive.setSpecular(0.8, 1.0, 0.8, 1.0);
    this.borderActive.setShininess(50);

    this.fillNormal = new CGFappearance(this.scene);
    this.fillNormal.setAmbient(0.9, 0.4, 0.1, 0.5);
    this.fillNormal.setDiffuse(0.9, 0.4, 0.1, 0.5);
    this.fillNormal.setSpecular(0.1, 0.1, 0.1, 0.5);
    this.fillNormal.setShininess(1);
    this.fillNormal.setEmission(0.9, 0.4, 0.1, 0.5);

    this.fillActive = new CGFappearance(this.scene);
    this.fillActive.setAmbient(0.2, 0.9, 0.2, 0.5);
    this.fillActive.setDiffuse(0.2, 0.9, 0.2, 0.5);
    this.fillActive.setSpecular(0.1, 0.1, 0.1, 0.5);
    this.fillActive.setShininess(1);
    this.fillActive.setEmission(0.2, 0.9, 0.2, 0.5);
  }

  // Método chamado pela lógica do jogo para mudar o visual
  setIntersecting(state) {
    this.isIntersecting = state;
  }

  display() {
    this.scene.pushMatrix();
    this.scene.gl.enable(this.scene.gl.BLEND);
    this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
    this.scene.gl.depthMask(false);

    const fillApp = this.isIntersecting ? this.fillActive : this.fillNormal;
    fillApp.apply();

    this.scene.scale(this.radius, 1, this.radius);
    
    // Renderizar o círculo virado para cima
    super.display();
    
    // Renderizar o círculo virado para baixo (rodar 180 graus em torno do eixo X)
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    super.display();
    this.scene.popMatrix();

    this.scene.gl.depthMask(true);
    this.scene.gl.disable(this.scene.gl.BLEND);

    this.scene.popMatrix();

    // B. Desenhar o anel delimitador (Cilindro)
    this.scene.pushMatrix();
    
    // Lógica Avançada de Visual Feedback: muda a cor com base na colisão
    if (this.isIntersecting) {
        this.borderActive.apply();
    } else {
        this.borderNormal.apply();
    }
    
    // Fazemos o cilindro ter o mesmo raio do círculo, mas ser muito baixinho (0.2 de altura)
    this.scene.scale(this.radius, 0.35, this.radius); 
    this.scene.rotate(-Math.PI / 2, 1, 0, 0); 
    this.border.display();
    
    this.scene.popMatrix();
  }
}