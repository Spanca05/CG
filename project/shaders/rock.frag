precision mediump float;

varying vec3 vNormal;

uniform vec3 baseColor;
uniform vec3 uLightDir;
uniform float uLightIntensity;

void main() {
    vec3 n = normalize(vNormal);

    float diffuse = max(dot(n, uLightDir), 0.0);
    float lighting = 0.25 * uLightIntensity + 0.75 * diffuse * uLightIntensity;

    gl_FragColor = vec4(baseColor * lighting, 1.0);
}