attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uHeightScale;
uniform float uNoiseScale;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec2 vWorldXZ;

// Random gradient vector at integer grid point p
vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7,  74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
}

// Gradient noise: dot product of random gradient with offset, then interpolate
float gradientNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    // Quintic fade curve (Ken Perlin, 2002) - smoother than cubic smoothstep
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    float n000 = dot(hash3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0));
    float n100 = dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
    float n010 = dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
    float n110 = dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
    float n001 = dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
    float n101 = dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
    float n011 = dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
    float n111 = dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));

    return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
               mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
}

// FBM: combine 6 octaves with halving amplitude and doubling frequency
float fbm(vec3 p) {
    float total = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxAmplitude = 0.0;

    for (int i = 0; i < 6; i++) {
        total += gradientNoise(p * frequency) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return total / maxAmplitude;
}

float terrainHeight(float x, float z) {
    return fbm(vec3(x * uNoiseScale, 0.5, z * uNoiseScale)) * uHeightScale;
}

void main() {
    vec3 position = aVertexPosition;

    // Finite-difference normals: sample height at 4 neighbors
    float eps = 3.5;
    float hL = terrainHeight(aVertexPosition.x - eps, aVertexPosition.z);
    float hR = terrainHeight(aVertexPosition.x + eps, aVertexPosition.z);
    float hD = terrainHeight(aVertexPosition.x, aVertexPosition.z - eps);
    float hU = terrainHeight(aVertexPosition.x, aVertexPosition.z + eps);
    vec3 normal = normalize(vec3(hL - hR, 2.0 * eps, hD - hU));

    vNormal = normalize(vec3(uNMatrix * vec4(normal, 0.0)));
    vTexCoord = aTextureCoord;
    vWorldXZ = vec2(aVertexPosition.x, aVertexPosition.z);

    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}
