#version 450
layout(location = 0) in vec2 v_Uv;

layout(location = 0) out vec4 o_Target;

layout(set = 2, binding = 0) uniform vec4 CustomMaterial_color;

layout(set = 2, binding = 1) uniform texture2D CustomMaterial_texture;
layout(set = 2, binding = 2) uniform sampler CustomMaterial_sampler;

// wgsl modules can be imported and used in glsl
// FIXME - this doesn't work any more ...
// #import bevy_pbr::pbr_functions as PbrFuncs

void main() {
   // Texture binding: make sure you're using the correct uniform name (CustomMaterial_texture) if it's a custom shader
    float hL = texture(sampler2D(CustomMaterial_texture,CustomMaterial_sampler), v_Uv + vec2(-1.0, 0.0) * vec2(1.0 / 512.0)).r;
    float hR = texture(sampler2D(CustomMaterial_texture,CustomMaterial_sampler), v_Uv + vec2(1.0, 0.0) * vec2(1.0 / 512.0)).r;
    float hD = texture(sampler2D(CustomMaterial_texture,CustomMaterial_sampler), v_Uv + vec2(0.0, -1.0) * vec2(1.0 / 512.0)).r;
    float hU = texture(sampler2D(CustomMaterial_texture,CustomMaterial_sampler), v_Uv + vec2(0.0, 1.0) * vec2(1.0 / 512.0)).r;

    // Calculate the gradients (approximate normal map in the XY directions)
    float dx = hR - hL;
    float dy = hU - hD;

    // Compute normal vector (use simple tangent-space normal map generation)
    vec3 normal = normalize(vec3(dx, dy, 1.0));

    // Convert the normal to a [0, 1] range and output
    normal = normal * 0.5 + 0.5;

    o_Target = vec4(normal, 1.0);  // Output as RGB for normal map
}