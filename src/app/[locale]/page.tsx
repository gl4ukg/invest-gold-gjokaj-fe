import Image from "next/image";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import Header from "../components/Header";
import RingsSection from "../components/Rings";
import JewelrySection from "../components/JewelerySection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import { useTranslations } from "next-intl";

export default function Home() {

  const t = useTranslations("about")

  return (
    <div>
      <Header />
      <AboutSection
        id="about"
        title={t("title")}
        description={t("subtitle")}
        imageSrc="/images/gold-story-01.png"
        imageAlt={t("title")}
      />
      <RingsSection />
      <JewelrySection/>
      <ServicesSection />
      <ContactSection />
    </div>
  );
}
