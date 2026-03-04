import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

export function JavaScriptIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#F7DF1E" />
            <path d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247L210.29 147.43c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574" fill="#000" />
        </svg>
    );
}

export function PythonIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pyA" x1="12.959%" x2="79.639%" y1="12.039%" y2="78.201%">
                    <stop offset="0%" stopColor="#387EB8" />
                    <stop offset="100%" stopColor="#366994" />
                </linearGradient>
                <linearGradient id="pyB" x1="19.128%" x2="90.742%" y1="20.579%" y2="88.429%">
                    <stop offset="0%" stopColor="#FFE052" />
                    <stop offset="100%" stopColor="#FFC331" />
                </linearGradient>
            </defs>
            <path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="url(#pyA)" />
            <path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="url(#pyB)" />
        </svg>
    );
}

export function HtmlIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#E44D26" />
            <path d="M48 48l14.4 160L128 224l65.6-16L208 48H48zm130.2 48H96.8l2.4 28h76.8l-5.6 64-42.4 12-42.4-12-2.8-32h26.4l1.6 16 17.2 4.8 17.2-4.8 2-20H93.2L88 80h80l-2.4 16h12.6z" fill="#fff" />
        </svg>
    );
}

export function CssIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#1572B6" />
            <path d="M48 48l14.4 160L128 224l65.6-16L208 48H48zm130.2 48H96.8l2.4 28h76.8l-5.6 64-42.4 12-42.4-12-2.8-32h26.4l1.6 16 17.2 4.8 17.2-4.8 2-20H93.2L88 80h80l-2.4 16h12.6z" fill="#fff" />
        </svg>
    );
}

export function LogicIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="28" fill="#8B5CF6" />
            <g fill="#fff">
                <path d="M80 68h96v24H104v24h48v24h-48v24h72v24H80V68z" />
                <circle cx="176" cy="128" r="12" />
                <circle cx="80" cy="128" r="8" opacity="0.5" />
            </g>
            <path d="M128 200l-20-16h40l-20 16z" fill="#C4B5FD" />
        </svg>
    );
}

export function SqlIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 264" xmlns="http://www.w3.org/2000/svg">
            <path d="M128 0C57.308 0 0 28.654 0 64v136c0 35.346 57.308 64 128 64s128-28.654 128-64V64c0-35.346-57.308-64-128-64z" fill="#336791" />
            <ellipse cx="128" cy="64" rx="128" ry="64" fill="#4A8BBE" />
            <path d="M128 16C66.144 16 16 37.49 16 64s50.144 48 112 48 112-21.49 112-48S189.856 16 128 16z" fill="#336791" />
            <text x="128" y="178" textAnchor="middle" fill="#fff" fontSize="72" fontWeight="bold" fontFamily="Arial, sans-serif">SQL</text>
        </svg>
    );
}

export function ReactIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="-11.5 -10.232 23 20.463" xmlns="http://www.w3.org/2000/svg">
            <circle r="2.05" fill="#61DAFB" />
            <g stroke="#61DAFB" fill="none" strokeWidth="1">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
        </svg>
    );
}

// Map category IDs to their icon components
export const languageIconMap: Record<string, React.FC<IconProps>> = {
    javascript: JavaScriptIcon,
    python: PythonIcon,
    html: HtmlIcon,
    css: CssIcon,
    logica: LogicIcon,
    sql: SqlIcon,
    react: ReactIcon,
};
