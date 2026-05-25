precision highp float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec2 vWorldXZ;

uniform sampler2D uSampler;      // grass texture (unit 0)
uniform sampler2D uPathSampler;  // path texture  (unit 1)
uniform vec3 uLightDir;
uniform float uLightIntensity;

float pathCenterX(float z) {
    return sin(z * 0.035) * 9.0 + sin(z * 0.18) * 0.35;
}

void main() {
    float cx = pathCenterX(vWorldXZ.y);
    float dist = abs(vWorldXZ.x - cx);

    // Taper: path narrows at both ends (matches MyPath.js taper formula)
    float halfLength = 250.0;
    float t = clamp((vWorldXZ.y + halfLength) / (halfLength * 2.0), 0.0, 1.0);
    float taper = 0.88 + 0.12 * cos(t * 3.14159);
    float halfWidth = 7.0 * taper;

    // Smooth blend: 1 = path texture, 0 = terrain texture
    float blend = 1.0 - smoothstep(halfWidth - 1.5, halfWidth + 1.5, dist);

    // Path UV: world-space tiling, one stone tile per 14 units
    vec2 pathUV = vWorldXZ / 14.0;

    vec4 terrainColor = texture2D(uSampler,     vTexCoord);
    vec4 pathColor    = texture2D(uPathSampler, pathUV);
    vec4 texColor     = mix(terrainColor, pathColor, blend);

    vec3 n = normalize(vNormal);
    float diffuse = max(dot(n, normalize(uLightDir)), 0.0);
    float lighting = 0.25 * uLightIntensity + 0.75 * diffuse * uLightIntensity;

    gl_FragColor = vec4(texColor.rgb * lighting, texColor.a);
}
