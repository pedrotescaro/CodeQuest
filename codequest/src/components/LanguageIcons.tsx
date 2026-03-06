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

export function TypeScriptIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#3178C6" />
            <path d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.796 10.669-11.672 2.621-4.876 3.931-10.94 3.931-18.191 0-5.237-0.809-9.768-2.427-13.593-1.618-3.825-3.874-7.247-6.768-10.267-2.894-3.019-6.336-5.754-10.325-8.204-3.99-2.45-8.377-4.761-13.163-6.934-3.476-1.554-6.594-3.078-9.352-4.573-2.758-1.495-5.103-3.019-7.036-4.573-1.933-1.554-3.418-3.222-4.456-5.006-1.038-1.784-1.557-3.825-1.557-6.126 0-2.071 0.461-3.94 1.384-5.61 0.922-1.669 2.248-3.107 3.977-4.314 1.729-1.208 3.828-2.128 6.296-2.763 2.469-0.634 5.237-0.951 8.306-0.951 2.183 0 4.492 0.202 6.928 0.605 2.436 0.404 4.872 1.035 7.308 1.899 2.436 0.864 4.756 1.956 6.96 3.281 2.204 1.324 4.175 2.878 5.913 4.66v-25.373c-4.088-1.669-8.55-2.878-13.394-3.627-4.843-0.749-10.267-1.121-16.27-1.121-6.565 0-12.772 0.749-18.62 2.246-5.849 1.496-11.013 3.825-15.504 6.98-4.491 3.166-8.048 7.132-10.669 11.904-2.621 4.772-3.931 10.44-3.931 17.004 0 8.644 2.505 15.995 7.515 22.053 5.01 6.058 12.35 11.064 22.021 15.017 3.764 1.554 7.24 3.107 10.43 4.661 3.188 1.554 5.945 3.194 8.268 4.918 2.323 1.726 4.146 3.627 5.471 5.698 1.326 2.071 1.99 4.487 1.99 7.246 0 1.899-0.403 3.684-1.21 5.352-0.808 1.669-2.05 3.107-3.727 4.314-1.678 1.208-3.794 2.157-6.354 2.848-2.558 0.691-5.585 1.036-9.077 1.036-5.905 0-11.694-1.093-17.366-3.281-5.672-2.187-10.841-5.439-15.504-9.755z" fill="#fff" />
            <path d="M 74.292 98.256 L 74.292 113.136 L 109.262 113.136 L 109.262 228.944 L 128.998 228.944 L 128.998 113.136 L 163.938 113.136 L 163.938 98.256 L 74.292 98.256 Z" fill="#fff" />
        </svg>
    );
}

export function JavaIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#E76F00" />
            <g fill="#fff">
                <path d="M97.5 166.3s-7.6 4.4 5.4 5.9c15.8 1.8 23.8 1.5 41.2-1.7 0 0 4.6 2.9 10.9 5.3-38.8 16.6-87.8-1-57.5-9.5zm-4.7-21.7s-8.5 6.3 4.5 7.6c16.8 1.7 30.1 1.8 53.1-2.5 0 0 3.2 3.2 8.2 5-46.9 13.7-99.2 1.1-65.8-10.1z" />
                <path d="M143.3 113.7c9.6 11-2.5 20.9-2.5 20.9s24.3-12.5 13.1-28.2c-10.4-14.6-18.4-21.9 24.8-47 0 0-67.8 16.9-35.4 54.3z" />
                <path d="M188.5 181.3s5.6 4.6-6.2 8.2c-22.3 6.8-92.9 8.8-112.5.3-7-3.1 6.2-7.3 10.4-8.2 4.4-.9 6.9-.8 6.9-.8-7.9-5.6-51.3 11-22 15.7 79.8 12.9 145.5-5.7 123.4-15.2zM101.8 119s-36.4 8.6-12.9 11.8c9.9 1.3 29.7 1 48.1-.5 15.1-1.3 30.2-4 30.2-4s-8.4 3.6-14.5 7.8c-58.5 15.4-171.5-8.1-69.5-14.4 17.7-1.1 18.6 .3 18.6-.7zM170 156.7c59.5-30.9 32-60.6 12.8-56.6-4.7 1-6.8 1.8-6.8 1.8s1.8-2.7 5.1-3.9c38-13.4 67.3 39.5-12.3 60.5 0 0 .9-.8 1.2-1.8z" />
                <path d="M146.1 0s32.9 32.9-31.2 83.5c-51.4 40.5-11.7 63.7 0 90.1-30-27.1-52-50.9-37.3-73.1C99.5 68 158.3 52.2 146.1 0z" />
                <path d="M105.3 225c57.1 3.7 144.7-2 146.8-28.8 0 0-4 10.2-47.2 18.4-48.7 9.2-108.8 8.1-144.4 2.2 0 0 7.3 6 44.8 8.2z" />
            </g>
        </svg>
    );
}

export function CSharpIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#68217A" />
            <g transform="translate(40,40) scale(0.69)" fill="#fff">
                <path d="M128 0C56.42 0 0 57.42 0 128c0 70.58 56.42 128 128 128 70.58 0 128-57.42 128-128C256 57.42 199.58 0 128 0zm-7.48 200.85c-37.88 0-68.37-27.6-68.37-72.85 0-45.24 30.49-72.85 68.37-72.85 28.72 0 47.36 15.68 54.87 37.23l-28.34 11.79c-4.75-13.14-13.14-22.02-26.53-22.02-21.64 0-34.03 18.27-34.03 45.85 0 27.6 12.39 45.86 34.03 45.86 15.68 0 23.52-9.62 27.6-22.4l27.96 12.02c-8.34 22.02-26.98 37.37-55.56 37.37z" />
                <path d="M176 96h16v16h-16V96zm0 32h16v16h-16v-16zm-24-16h16v16h-16v-16zm48 0h16v16h-16v-16zm-24 32h16v16h-16v-16zm-24-16h16v16h-16v-16zm48 0h16v16h-16v-16z" />
            </g>
        </svg>
    );
}

export function PhpIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#777BB4" />
            <g transform="translate(20,60)">
                <ellipse cx="108" cy="68" rx="100" ry="60" fill="#8993BE" opacity="0.3" />
                <text x="108" y="82" textAnchor="middle" fill="#fff" fontSize="64" fontWeight="bold" fontFamily="Arial, sans-serif">php</text>
            </g>
        </svg>
    );
}

export function GoIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#00ADD8" />
            <g transform="translate(28,68)">
                <text x="100" y="80" textAnchor="middle" fill="#fff" fontSize="84" fontWeight="bold" fontFamily="Arial, sans-serif">Go</text>
            </g>
        </svg>
    );
}

export function RubyIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#CC342D" />
            <g transform="translate(28, 28) scale(0.78)">
                <polygon points="128,20 220,80 200,200 56,200 36,80" fill="#fff" opacity="0.9" />
                <polygon points="128,50 190,90 175,180 81,180 66,90" fill="#CC342D" />
                <polygon points="128,70 165,100 155,160 101,160 91,100" fill="#fff" opacity="0.4" />
            </g>
        </svg>
    );
}

export function KotlinIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ktGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E44857" />
                    <stop offset="50%" stopColor="#C711E1" />
                    <stop offset="100%" stopColor="#7F52FF" />
                </linearGradient>
            </defs>
            <rect width="256" height="256" rx="12" fill="url(#ktGrad)" />
            <path d="M48 208L128 128L208 208H48Z" fill="#fff" />
            <path d="M48 48L128 128L48 208V48Z" fill="#fff" />
            <path d="M128 48L48 128V48H128Z" fill="#fff" opacity="0.8" />
            <path d="M208 48L128 128L208 48Z" fill="#fff" opacity="0" />
            <path d="M128 48H208L128 128L128 48Z" fill="#fff" opacity="0.6" />
        </svg>
    );
}

export function SwiftIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="swGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F05138" />
                    <stop offset="100%" stopColor="#EF4223" />
                </linearGradient>
            </defs>
            <rect width="256" height="256" rx="12" fill="url(#swGrad)" />
            <path d="M182 80c0 0-38 38-88 68 30-10 58-28 78-48-30 32-78 62-118 72 12 4 26 6 42 4 44-6 86-46 86-96z" fill="#fff" />
            <path d="M150 60c-20-16-50-24-80-20 30 18 54 40 70 64 0 0 30-24 10-44z" fill="#fff" opacity="0.8" />
        </svg>
    );
}

export function CppIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#00599C" />
            <g transform="translate(40,40) scale(0.69)" fill="#fff">
                <path d="M128 0C56.42 0 0 57.42 0 128c0 70.58 56.42 128 128 128 70.58 0 128-57.42 128-128C256 57.42 199.58 0 128 0zm-7.48 200.85c-37.88 0-68.37-27.6-68.37-72.85 0-45.24 30.49-72.85 68.37-72.85 28.72 0 47.36 15.68 54.87 37.23l-28.34 11.79c-4.75-13.14-13.14-22.02-26.53-22.02-21.64 0-34.03 18.27-34.03 45.85 0 27.6 12.39 45.86 34.03 45.86 15.68 0 23.52-9.62 27.6-22.4l27.96 12.02c-8.34 22.02-26.98 37.37-55.56 37.37z" />
                <g transform="translate(145, 85)">
                    <rect x="0" y="18" width="42" height="6" />
                    <rect x="18" y="0" width="6" height="42" />
                    <rect x="52" y="18" width="42" height="6" />
                    <rect x="70" y="0" width="6" height="42" />
                </g>
            </g>
        </svg>
    );
}

export function GitIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#F05032" />
            <g transform="translate(28, 28) scale(0.78)" fill="#fff">
                <path d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.826 20.267 4.66 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.27-4.27-21.334l-26.462-26.462-.003 69.637c1.877.95 3.635 2.232 5.134 3.73 7.664 7.662 7.664 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.665-7.671-7.665-20.085 0-27.746 1.88-1.879 4.028-3.32 6.296-4.2V87.116c-2.268-.874-4.376-2.217-6.296-4.093-5.818-5.818-7.19-14.416-4.165-21.503L81.484 32.088 4.828 108.744c-6.435 6.44-6.435 16.873 0 23.302l111.774 111.768c6.44 6.44 16.873 6.44 23.322 0l110.248-110.217c6.442-6.442 6.442-16.88 0-23.003z" />
            </g>
        </svg>
    );
}

export function FlutterIcon({ size = 24 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="12" fill="#027DFD" />
            <g transform="translate(40, 28) scale(0.69)">
                <path d="M145.5 4.8L34.1 116.7l35 35.1L215.5 4.8h-70zM145.5 116.7L89.2 173.2l35.1 35 21.2-21.3 35.1-35-35.1-35.2z" fill="#42A5F5" />
                <path d="M124.3 208.2l21.2 21.2h70l-56.1-56.2-35.1 35z" fill="#0D47A1" />
                <path d="M89.2 173.2l35.1-35.1 35.2 35.1-35.2 35-35.1-35z" fill="#42A5F5" opacity="0.8" />
            </g>
        </svg>
    );
}

// Map category IDs to their icon components
export const languageIconMap: Record<string, React.FC<IconProps>> = {
    javascript: JavaScriptIcon,
    python: PythonIcon,
    html: HtmlIcon,
    htmlcss: HtmlIcon,
    css: CssIcon,
    logica: LogicIcon,
    sql: SqlIcon,
    react: ReactIcon,
    typescript: TypeScriptIcon,
    java: JavaIcon,
    csharp: CSharpIcon,
    php: PhpIcon,
    go: GoIcon,
    ruby: RubyIcon,
    kotlin: KotlinIcon,
    swift: SwiftIcon,
    cpp: CppIcon,
    git: GitIcon,
    flutter: FlutterIcon,
};
