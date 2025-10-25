import { json } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { Card, Layout, Text, BlockStack } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  return json({
    shop: session.shop,
  });
}

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <BlockStack gap="400">
            <Text as="h1" variant="headingLg">
              Welcome to Your Shopify App
            </Text>
            <Text as="p" variant="bodyMd">
              Shop: {shop}
            </Text>
            <Text as="p" variant="bodyMd">
              This is a minimal Shopify app template using yarn workspaces with
              separate packages for core utilities and database management.
            </Text>
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

