precision mediump float;

varying float vHeight;
varying vec3 vNormal;

uniform vec3 baseColor;
uniform vec3 tipColor;
uniform vec3 uLightDir;
uniform float uLightIntensity;

void main() {
    vec3 color = mix(baseColor, tipColor, vHeight);

    vec3 n = normalize(vNormal);
    float diffuse = max(dot(n, uLightDir), 0.0);
    float lighting = 0.25 * uLightIntensity + 0.75 * diffuse * uLightIntensity;

    gl_FragColor = vec4(color * lighting, 1.0);
}