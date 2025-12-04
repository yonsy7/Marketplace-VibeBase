import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function TemplateRejectedEmail({ 
  templateTitle, 
  reason 
}: { 
  templateTitle: string; 
  reason?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your template submission needs revision</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container style={container}>
            <Text className="text-2xl font-semibold">Hello,</Text>
            <Text className="text-lg text-gray-600">
              We've reviewed your template submission <strong>{templateTitle}</strong> and unfortunately, it doesn't meet our quality standards at this time.
            </Text>
            {reason && (
              <Section className="bg-gray-50 p-4 rounded-lg mt-4">
                <Text className="text-sm font-semibold mb-2">Feedback:</Text>
                <Text className="text-sm text-gray-700">{reason}</Text>
              </Section>
            )}
            <Text className="text-lg text-gray-600 mt-6">
              Please review the feedback above and feel free to resubmit your template after making the necessary improvements.
            </Text>
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
