export async function getInventoryByLocation(graphql) {
  const response = await graphql(`#graphql
    query GetInventoryByLocation {
      products(first: 25) {
        nodes {
          id
          title
          variants(first: 10) {
            nodes {
              id
              title
              inventoryItem {
                inventoryLevels(first: 10) {
                  nodes {
                    location { id name }
                    quantities(names: ["available"]) { quantity }
                  }
                }
              }
            }
          }
        }
      }
    }`);

  const { data } = await response.json();

  return data.products.nodes.flatMap((product) =>
    product.variants.nodes.map((variant) => ({
      id: variant.id,
      product: product.title,
      variant: variant.title,
      stock: variant.inventoryItem.inventoryLevels.nodes.map((level) => ({
        location: level.location.name,
        quantity: level.quantities[0].quantity,
      })),
    })),
  );
}