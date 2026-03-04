'use client';

interface CatMascotProps {
    size?: number;
    className?: string;
}

export default function CatMascot({ size = 170, className = '' }: CatMascotProps) {
    const scale = size / 170;

    return (
        <div
            className={`cat-mascot ${className}`}
            style={{
                position: 'relative',
                height: `${size}px`,
                width: `${size * 1.13}px`,
            }}
        >
            {/* Ears */}
            <div className="cat-ear cat-ear--left" />
            <div className="cat-ear cat-ear--right" />

            {/* Face */}
            <div className="cat-face">
                {/* Left Eye */}
                <div className="cat-eye cat-eye--left">
                    <div className="cat-eye-pupil" />
                </div>

                {/* Right Eye */}
                <div className="cat-eye cat-eye--right">
                    <div className="cat-eye-pupil" />
                </div>

                {/* Muzzle */}
                <div className="cat-muzzle" />
            </div>

            <style jsx>{`
        .cat-mascot {
          position: relative;
          filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3));
        }

        /* Ears */
        .cat-ear {
          position: absolute;
          top: -30%;
          height: 60%;
          width: 25%;
          background: #ffffff;
        }

        .cat-ear::before,
        .cat-ear::after {
          content: '';
          position: absolute;
          bottom: 24%;
          height: 10%;
          width: 5%;
          border-radius: 50%;
          background: #161616;
        }

        .cat-ear::after {
          transform-origin: 50% 100%;
        }

        .cat-ear--left {
          left: -7%;
          border-radius: 70% 30% 0% 0% / 100% 100% 0% 0%;
          transform: rotate(-15deg);
        }

        .cat-ear--left::before,
        .cat-ear--left::after {
          right: 10%;
        }

        .cat-ear--left::after {
          transform: rotate(-45deg);
        }

        .cat-ear--right {
          right: -7%;
          border-radius: 30% 70% 0% 0% / 100% 100% 0% 0%;
          transform: rotate(15deg);
        }

        .cat-ear--right::before,
        .cat-ear--right::after {
          left: 10%;
        }

        .cat-ear--right::after {
          transform: rotate(45deg);
        }

        /* Face */
        .cat-face {
          position: absolute;
          height: 100%;
          width: 100%;
          background: #161616;
          border-radius: 50%;
        }

        /* Eyes */
        .cat-eye {
          position: absolute;
          top: 35%;
          height: 30%;
          width: 31%;
          background: #ffffff;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        }

        .cat-eye::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 0;
          width: 100%;
          border-radius: 0 0 50% 50% / 0 0 40% 40%;
          background: #161616;
          animation: catBlink 4s infinite ease-in;
        }

        @keyframes catBlink {
          0% { height: 0; }
          90% { height: 0; }
          92.5% { height: 100%; }
          95% { height: 0; }
          97.5% { height: 100%; }
          100% { height: 0; }
        }

        .cat-eye::before {
          content: '';
          position: absolute;
          top: 60%;
          height: 10%;
          width: 15%;
          background: #ffffff;
          border-radius: 50%;
        }

        .cat-eye--left {
          left: 0;
        }

        .cat-eye--left::before {
          right: -5%;
        }

        .cat-eye--right {
          right: 0;
        }

        .cat-eye--right::before {
          left: -5%;
        }

        /* Pupils */
        .cat-eye-pupil {
          position: absolute;
          top: 25%;
          height: 50%;
          width: 20%;
          background: #161616;
          border-radius: 50%;
          animation: catLookAround 4s infinite;
        }

        @keyframes catLookAround {
          0% { transform: translate(0); }
          5% { transform: translate(50%, -25%); }
          10% { transform: translate(50%, -25%); }
          15% { transform: translate(-100%, -25%); }
          20% { transform: translate(-100%, -25%); }
          25% { transform: translate(0, 0); }
          100% { transform: translate(0, 0); }
        }

        .cat-eye--left .cat-eye-pupil {
          right: 30%;
        }

        .cat-eye--right .cat-eye-pupil {
          left: 30%;
        }

        .cat-eye-pupil::after {
          content: '';
          position: absolute;
          top: 30%;
          right: -5%;
          height: 20%;
          width: 35%;
          border-radius: 50%;
          background: #ffffff;
        }

        /* Muzzle */
        .cat-muzzle {
          position: absolute;
          top: 60%;
          left: 50%;
          height: 6%;
          width: 10%;
          background: #ffffff;
          transform: translateX(-50%);
          border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
        }
      `}</style>
        </div>
    );
}
