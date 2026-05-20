precision mediump float;

varying vec3 vNormal;

void main() {
    vec3 baseColor = vec3(0.25, 0.45, 0.12);
    gl_FragColor = vec4(baseColor, 1.0);
}