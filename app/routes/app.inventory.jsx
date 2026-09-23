import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getInventoryByLocation } from "../models/inventory.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return { items: await getInventoryByLocation(admin.graphql) };
};

export default function Inventory() {
  const { items } = useLoaderData();

  return (
    <s-page heading="Inventory by location">
      <s-section heading="Stock levels across all Aura locations">
        {items.map((item) => (
          <s-box key={item.id} padding="base">
            <s-heading>{item.product}</s-heading>
            {item.stock.map((level) => (
              <s-paragraph key={level.location}>
                {level.location}: {level.quantity} available
                {level.quantity === 0 ? " — out of stock" : ""}
              </s-paragraph>
            ))}
          </s-box>
        ))}
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);