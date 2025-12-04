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

export default function TemplateApprovedEmail({ 
  templateTitle, 
  templateSlug 
}: { 
  templateTitle: string; 
  templateSlug: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marshal-ui-yt.vercel.app';
  const templateUrl = `${baseUrl}/templates/${templateSlug}`;

  return (
    <Html>
      <Head />
      <Preview>Your template has been approved!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container style={container}>
            <Text className="text-2xl font-semibold">Congratulations!</Text>
            <Text className="text-lg text-gray-600">
              Your template <strong>{templateTitle}</strong> has been approved and is now live on MarshalUI!
            </Text>
            <Text className="text-lg text-gray-600">
              Users can now discover and purchase your template.
            </Text>
            <Section className="w-full flex justify-center mt-7">
              <Button
                href={templateUrl}
                className="text-white bg-green-500 rounded-lg px-10 py-4"
              >
                View Template
              </Button>
            </Section>
            <Text className="text-lg mt-6">
              Keep creating amazing templates!<br />MarshalUI Team
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
