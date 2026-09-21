import React from "react";

const ProfileAvatar = ({ src, alt = "Profile" }) => {
  return (
    <>
      <style>
        {`
          @keyframes profileFloat {
            0%, 100% {
              transform: translateY(0px) rotateX(0deg) rotateY(-6deg);
            }

            50% {
              transform: translateY(-14px) rotateX(6deg) rotateY(6deg);
            }
          }

          .profile-avatar-wrapper {
            position: relative;
            width: 180px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 800px;
          }

          .profile-avatar-glow {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(120, 100, 255, 0.35),
              transparent 70%
            );
            filter: blur(18px);
          }

          .profile-avatar-3d {
            position: relative;
            z-index: 2;
            width: 150px;
            height: 150px;
            animation: profileFloat 4s ease-in-out infinite;
            transform-style: preserve-3d;
            transition: transform 0.3s ease;
          }

          .profile-avatar-3d:hover {
            transform: scale(1.08) rotateY(15deg) rotateX(-5deg);
          }

          .profile-avatar-image {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 50%;
            border: 5px solid white;
            outline: 5px solid #9f1239;

            box-shadow:
              0 20px 35px rgba(0, 0, 0, 0.20),
              0 5px 15px rgba(0, 0, 0, 0.15);

            display: block;
          }
        `}
      </style>

      <div className="profile-avatar-wrapper">

        {/* Glow behind the image */}
        <div className="profile-avatar-glow"></div>

        {/* Animated 3D image */}
        <div className="profile-avatar-3d">

          <img
            src={src}
            alt={alt}
            className="profile-avatar-image"
          />

        </div>

      </div>
    </>
  );
};

export default ProfileAvatar;