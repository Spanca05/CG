attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uNoiseScale;
uniform float uNoiseStrength;

varying vec3 vNormal;

float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float valueNoise(vec3 p) {
    vec3 cell = floor(p);
    vec3 f = fract(p);
    vec3 smoothF = f * f * (3.0 - 2.0 * f);

    float n000 = hash(cell + vec3(0.0, 0.0, 0.0));
    float n100 = hash(cell + vec3(1.0, 0.0, 0.0));
    float n010 = hash(cell + vec3(0.0, 1.0, 0.0));
    float n110 = hash(cell + vec3(1.0, 1.0, 0.0));
    float n001 = hash(cell + vec3(0.0, 0.0, 1.0));
    float n101 = hash(cell + vec3(1.0, 0.0, 1.0));
    float n011 = hash(cell + vec3(0.0, 1.0, 1.0));
    float n111 = hash(cell + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, smoothF.x);
    float nx10 = mix(n010, n110, smoothF.x);
    float nx01 = mix(n001, n101, smoothF.x);
    float nx11 = mix(n011, n111, smoothF.x);

    float nxy0 = mix(nx00, nx10, smoothF.y);
    float nxy1 = mix(nx01, nx11, smoothF.y);

    return mix(nxy0, nxy1, smoothF.z);
}

float fbm(vec3 p) {
    float total = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int octave = 0; octave < 4; octave++) {
        total += amplitude * valueNoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return total;
}

float displace(vec3 n) {
    float noise = fbm(n * uNoiseScale) - 0.5;
    noise = sign(noise) * pow(abs(noise), 0.7);
    return noise * uNoiseStrength;
}

vec3 displacedPos(vec3 sphereNormal) {
    vec3 squashed = vec3(sphereNormal.x, sphereNormal.y * 0.65, sphereNormal.z);
    vec3 sn = normalize(squashed);
    return squashed + sn * displace(sn);
}

void main() {
    vec3 n = aVertexNormal;
    vec3 position = displacedPos(n);

    float eps = 0.02;
    vec3 up = abs(n.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent   = normalize(cross(up, n));
    vec3 bitangent = normalize(cross(n, tangent));

    vec3 posT = displacedPos(normalize(n + eps * tangent));
    vec3 posB = displacedPos(normalize(n + eps * bitangent));

    vec3 displacedNormal = normalize(cross(posT - position, posB - position));
    if (dot(displacedNormal, n) < 0.0) displacedNormal = -displacedNormal;

    vNormal = normalize(vec3(uNMatrix * vec4(displacedNormal, 0.0)));
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}