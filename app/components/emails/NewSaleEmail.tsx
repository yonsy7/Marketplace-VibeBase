import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function NewSaleEmail({ 
  templateTitle, 
  amount, 
  platformFee,
  netAmount,
  templateSlug 
}: { 
  templateTitle: string; 
  amount: number;
  platformFee: number;
  netAmount: number;
  templateSlug: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marshal-ui-yt.vercel.app';
  const dashboardUrl = `${baseUrl}/creator/dashboard`;

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>New sale: {templateTitle}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container style={container}>
            <Text className="text-2xl font-semibold">🎉 New Sale!</Text>
            <Text className="text-lg text-gray-600">
              Congratulations! Your template <strong>{templateTitle}</strong> has been purchased!
            </Text>
            <Section className="bg-gray-50 p-4 rounded-lg mt-4">
              <Text className="text-sm font-semibold mb-2">Sale Details:</Text>
              <Text className="text-sm text-gray-700">
                Template: {templateTitle}
              </Text>
              <Text className="text-sm text-gray-700">
                Sale Amount: {formatPrice(amount)}
              </Text>
              <Text className="text-sm text-gray-700">
                Platform Fee (10%): {formatPrice(platformFee)}
              </Text>
              <Text className="text-sm font-semibold text-green-600 mt-2">
                Your Earnings: {formatPrice(netAmount)}
              </Text>
            </Section>
            <Section className="w-full flex justify-center mt-7">
              <Button
                href={dashboardUrl}
                className="text-white bg-blue-500 rounded-lg px-10 py-4"
              >
                View Dashboard
              </Button>
            </Section>
            <Text className="text-lg mt-6">
              Keep up the great work!<br />MarshalUI Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};
