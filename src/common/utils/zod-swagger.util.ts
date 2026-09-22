import { ApiBody, ApiQuery, type SchemaObject } from "@nestjs/swagger";
import { ZodType, z } from "zod";

export function zodToOpenApiSchema(schema: ZodType): SchemaObject {
  const jsonSchema = z.toJSONSchema(schema, {
    io: "input",
    unrepresentable: "any",
  }) as Record<string, unknown>;

  delete jsonSchema.$schema;

  return jsonSchema as SchemaObject;
}

export function ApiZodBody(
  schema: ZodType,
  description?: string,
): MethodDecorator {
  return ApiBody({
    schema: zodToOpenApiSchema(schema),
    description,
  });
}

export function ApiZodQuery(schema: ZodType): MethodDecorator {
  const openApi = zodToOpenApiSchema(schema);
  const properties = (openApi.properties ?? {}) as Record<string, SchemaObject>;
  const required = (openApi.required ?? []) as string[];

  const decorators = Object.entries(properties).map(([name, propSchema]) =>
    ApiQuery({
      name,
      required: required.includes(name),
      schema: propSchema,
    }),
  );

  // একাধিক decorator কে একটায় পরিণত করা
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    for (const decorate of decorators) {
      decorate(target, propertyKey, descriptor);
    }
  };
}
