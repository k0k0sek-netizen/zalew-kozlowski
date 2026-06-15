import { NavbarClient } from "./NavbarClient";
import Image from "next/image";
import { getWeatherAction } from "@/app/actions/weather";
import { getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { getLocale } from "next-intl/server";

export const Navbar = async () => {
    const { isEnabled } = await draftMode();
    const locale = await getLocale();
    const [weatherData, infoBlocks] = await Promise.all([
        getWeatherAction(),
        getInfoBlocks(isEnabled, locale).catch(() => []),
    ]);

    const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";

    return <NavbarClient initialWeather={weatherData} phone={phone} />;
};
