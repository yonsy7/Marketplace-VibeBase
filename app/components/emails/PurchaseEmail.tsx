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

export default function PurchaseEmail({ link, templateTitle }: { link: string; templateTitle: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your template download is ready!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container style={container}>
            <Text className="text-2xl font-semibold">Hi there,</Text>
            <Text className="text-lg text-gray-600">
              Thank you for purchasing <strong>{templateTitle}</strong> from MarshalUI!
            </Text>
            <Text className="text-lg text-gray-600">
              Your download link is ready below.
            </Text>
            <Section className="w-full flex justify-center mt-7">
              <Button
                href={link}
                className="text-white bg-blue-500 rounded-lg px-10 py-4"
              >
                Download Template
              </Button>
            </Section>
            <Text className="text-lg mt-6">
              Best regards,<br />MarshalUI Team
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
