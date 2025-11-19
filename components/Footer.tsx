import React from "react";

function Footer() {
    return (
        <footer className="mt-16">
          <div className="relative h-24 w-full overflow-hidden">
            <svg
              className="absolute bottom-0 left-0 h-full w-full text-brandBlue"
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
            >
              {/* Böjd wave som lutar åt andra hållet */}
              <path
                fill="currentColor"
                d="
                  M0,20
                  C360,50 1080,-10 1440,20
                  L1440,80
                  L0,80
                  Z
                "
              />
            </svg>
          </div>
        </footer>
      );
}

export default Footer;
