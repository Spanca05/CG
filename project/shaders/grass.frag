precision mediump float;


varying float vHeight;

uniform vec3 baseColor;
uniform vec3 tipColor;

void main() {
    vec3 color = mix(baseColor, tipColor, vHeight);
    gl_FragColor = vec4(color, 1.0);
}