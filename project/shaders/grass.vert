attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float time;
uniform float windStrength;
uniform float windSpeed;

varying vec2 vTexCoord;
varying float vHeight;

void main() {
    vec3 position = aVertexPosition;

    float heightFactor = clamp(position.y, 0.0, 1.0);

    float wind = sin(time * windSpeed) * windStrength;

    position.x += wind * heightFactor * heightFactor;

    vTexCoord = aTextureCoord;
    vHeight = heightFactor;

    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}