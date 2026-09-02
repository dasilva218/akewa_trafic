import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";


export type roles = {
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    role: string;
    title: string;
    text: string;
    cta: string;
    primary: boolean;
}