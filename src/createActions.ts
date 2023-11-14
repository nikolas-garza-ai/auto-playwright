import { Page } from "@playwright/test";
import { randomUUID } from "crypto";
import { RunnableFunctionWithParse, RunnableFunctionWithoutParse } from "openai/lib/RunnableFunction";
import { z } from "zod";

export const createActions = (page: Page): (RunnableFunctionWithoutParse | RunnableFunctionWithParse<any>)[] => {
  const locatorMap = new Map();

  const getLocator = (elementId: string) => {
    const locator = locatorMap.get(elementId);

    if (!locator) {
      throw new Error("Unknown elementId");
    }

    return locator;
  };

  return [
    {
      function: async (args: {
        attributeName: string;
        cssSelector: string;
      }) => {
        const locator = await page.locator(args.cssSelector);

        const elementId = randomUUID();

        locatorMap.set(elementId, locator);

        return {
          elementId,
        };
      },
      name: "locateElement",
      description:
        "Locates element using a CSS selector and returns elementId. This element ID can be used with other functions to perform actions on the element.",
      parse: (args: string) => {
        return z
          .object({
            cssSelector: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          cssSelector: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: {
        attributeName: string;
        elementId: string;
      }) => {
        return {
          attributeValue: await getLocator(args.elementId).getAttribute(
            args.attributeName
          ),
        };
      },
      name: "locator_getAttribute",
      description: "Returns the matching element's attribute value.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
            attributeName: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          attributeName: {
            type: "string",
          },
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return { innerHTML: await getLocator(args.elementId).innerHTML() };
      },
      name: "locator_innerHTML",
      description: "Returns the element.innerHTML.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return { innerText: await getLocator(args.elementId).innerText() };
      },
      name: "locator_innerText",
      description: "Returns the element.innerText.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return {
          textContent: await getLocator(args.elementId).textContent(),
        };
      },
      name: "locator_textContent",
      description: "Returns the node.textContent.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return {
          inputValue: await getLocator(args.elementId).inputValue(),
        };
      },
      name: "locator_inputValue",
      description:
        "Returns input.value for the selected <input> or <textarea> or <select> element.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        await getLocator(args.elementId).blur();

        return { success: true };
      },
      name: "locator_blur",
      description: "Removes keyboard focus from the current element.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return await getLocator(args.elementId).boundingBox();
      },
      name: "locator_boundingBox",
      description:
        "This method returns the bounding box of the element matching the locator, or null if the element is not visible. The bounding box is calculated relative to the main frame viewport - which is usually the same as the browser window. The returned object has x, y, width, and height properties.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        await getLocator(args.elementId).check();

        return { success: true };
      },
      name: "locator_check",
      description: "Ensure that checkbox or radio element is checked.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        await getLocator(args.elementId).uncheck();

        return { success: true };
      },
      name: "locator_uncheck",
      description: "Ensure that checkbox or radio element is unchecked.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return { isChecked: await getLocator(args.elementId).isChecked() };
      },
      name: "locator_isChecked",
      description: "Returns whether the element is checked.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return {
          isEditable: await getLocator(args.elementId).isEditable(),
        };
      },
      name: "locator_isEditable",
      description:
        "Returns whether the element is editable. Element is considered editable when it is enabled and does not have readonly property set.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return { isEnabled: await getLocator(args.elementId).isEnabled() };
      },
      name: "locator_isEnabled",
      description:
        "Returns whether the element is enabled. Element is considered enabled unless it is a <button>, <select>, <input> or <textarea> with a disabled property.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return { isVisible: await getLocator(args.elementId).isVisible() };
      },
      name: "locator_isVisible",
      description: "Returns whether the element is visible.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        await getLocator(args.elementId).clear();

        return { success: true };
      },
      name: "locator_clear",
      description: "Clear the input field.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        await getLocator(args.elementId).click();

        return { success: true };
      },
      name: "locator_click",
      description: "Click an element.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { elementId: string }) => {
        return { elementCount: await getLocator(args.elementId).count() };
      },
      name: "locator_count",
      description: "Returns the number of elements matching the locator.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { value: string; elementId: string }) => {
        await getLocator(args.elementId).fill(args.value);

        return {
          success: true,
        };
      },
      name: "locator_fill",
      description: "Set a value to the input field.",
      parse: (args: string) => {
        return z
          .object({
            elementId: z.string(),
            value: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          value: {
            type: "string",
          },
          elementId: {
            type: "string",
          },
        },
      },
    },
    {
      function: async (args: { url: string }) => {
        return {
          url: await page.goto(args.url),
        };
      },
      name: "page_goto",
      description: "Set a value to the input field.",
      parse: (args: string) => {
        return z
          .object({
            cssLocator: z.string(),
            value: z.string(),
          })
          .parse(JSON.parse(args));
      },
      parameters: {
        type: "object",
        properties: {
          value: {
            type: "string",
          },
          cssLocator: {
            type: "string",
          },
        },
      },
    },
    {
      function: (args: { assertion: boolean }) => {
        return args;
      },
      parse: (args: string) => {
        return z
          .object({
            assertion: z.boolean(),
          })
          .parse(JSON.parse(args));
      },
      description:
        "This function is called when the initial instructions asked to assert something; then 'assertion' is either true or false (boolean) depending on whether the assertion succeeded.",
      name: "resultAssertion",
      parameters: {
        type: "object",
        properties: {
          assertion: {
            type: "boolean",
          },
        },
      },
    },
    {
      function: (args: { assertion: boolean }) => {
        return args;
      },
      parse: (args: string) => {
        return z
          .object({
            query: z.string(),
          })
          .parse(JSON.parse(args));
      },
      description:
        "This function is called at the end when the initial instructions asked to extract data; then 'query' property is set to a text value of the extracted data.",
      name: "resultQuery",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
          },
        },
      },
    },
    {
      function: () => {
        return null;
      },
      description:
        "This function is called at the end when the initial instructions asked to perform an action.",
      name: "resultAction",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    {
      function: (args: { errorMessage: string }) => {
        return {
          errorMessage: args.errorMessage,
        };
      },
      parse: (args: string) => {
        return z
          .object({
            errorMessage: z.string(),
          })
          .parse(JSON.parse(args));
      },
      description:
        "If user instructions cannot be completed, then this function is used to produce the final response.",
      name: "resultError",
      parameters: {
        type: "object",
        properties: {
          errorMessage: {
            type: "string",
          },
        },
      },
    },
  ];
};