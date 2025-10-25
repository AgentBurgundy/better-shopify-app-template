import { json, Outlet } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { AppProvider } from '@shopify/shopify-app-react-router/react';
import { Page } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || '',
  });
}

export default function AppLayout() {
  return (
    <AppProvider isEmbeddedApp>
      <Page>
        <Outlet />
      </Page>
    </AppProvider>
  );
}

