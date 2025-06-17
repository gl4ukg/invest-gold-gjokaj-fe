"use client";
import loadable from "@loadable/component";
import { useTranslations } from "next-intl";
import Loader from "./Loader";


const Header = loadable(() => import("@/app/components/Header"), {
    fallback: <div className="h-screen flex justify-center items-center"><Loader/></div>
});
const AboutSection = loadable(() => import("@/app/components/AboutSection"));
const RingsSection = loadable(() => import("@/app/components/Rings"));
const JewelrySection = loadable(() => import("@/app/components/JewelerySection"));
const ServicesSection = loadable(() => import("@/app/components/ServicesSection"));
const ContactSection = loadable(() => import("@/app/components/ContactSection"));


const HomeSection = () => {
    const t = useTranslations('about');
    return (
        <>
          <Header />
          <main className="overflow-x-hidden">
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
          </main>
        </>
    )
}

export default HomeSection;