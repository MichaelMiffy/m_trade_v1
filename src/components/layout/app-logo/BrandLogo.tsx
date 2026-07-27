// See: src/components/layout/app-logo/README.md for instructions
type TBrandLogoProps = {
    width?: number;
    height?: number;
    // fill?: string;
    className?: string;
};

export const BrandLogo = ({ width = 140, height = 32, className = '' }: TBrandLogoProps) => {
    const logoFill = '#b6ff2e'; // Lime Spark
    const textFill = '#23262f'; // Graphite

    return (
        <svg
            width={width}
            height={height}
            viewBox='0 0 140 32'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
            aria-label='M-Trade Logo'
        >
            {/* Logo Icon */}
            <g transform='translate(0, 2)'>
                <path
                    fill={logoFill}
                    transform='scale(0.875)'
                    d='M4.469 8.894c0.038-0.369-0.106-0.738-0.381-0.988l-2.819-3.4v-0.506h8.762l6.775 14.856 5.956-14.856h8.356v0.506l-2.412 2.313c-0.206 0.156-0.313 0.419-0.269 0.675v17c-0.044 0.256 0.063 0.519 0.269 0.675l2.356 2.313v0.506h-11.856v-0.506l2.444-2.369c0.238-0.238 0.238-0.313 0.238-0.675v-13.738l-6.794 17.244h-0.919l-7.9-17.244v11.556c-0.069 0.487 0.094 0.975 0.438 1.325l3.175 3.85v0.506h-9v-0.5l3.175-3.856c0.337-0.35 0.494-0.844 0.406-1.325z'
                />
            </g>

            {/* Brand Name */}
            <text
                x='38'
                y='21'
                fill={textFill}
                fontSize='16'
                fontWeight='700'
                fontFamily='Inter, Arial, Helvetica, sans-serif'
                letterSpacing='0.5'
            >
                - TRADE
            </text>
        </svg>
    );
};
