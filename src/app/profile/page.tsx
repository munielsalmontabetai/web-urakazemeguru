"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "@/components/ui/custom/SectionHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faHashtag,
  faUserTag,
  faCakeCandles,
  faRulerVertical,
  faFaceSmile,
  faFaceFrown,
} from "@fortawesome/free-solid-svg-icons";
import { Links } from "@/components/ui/custom/Links";

export default function ProfilePage() {
  const { profile, photos } = userConfig;

  // variantsが設定されていれば最初の1枚をデフォルトとして使用、なければdefaultをフォールバックとして使用
  const initialImage = photos.variants?.[0] || "";

  const [selectedImage, setSelectedImage] = useState(initialImage);

  return (
    <main className="min-h-screen relative bg-[var(--background)] pt-32 pb-20 overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)] opacity-[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[var(--secondary)] opacity-[0.03] blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionHeading>Profile</SectionHeading>
        </motion.div>

        <div className="mt-12 flex flex-col lg:flex-row gap-16 items-start">
          {/* 左カラム：写真（立ち絵）とバリエーション */}
          <div className="w-full lg:w-5/12 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gradient-to-tr from-[var(--primary)]/10 to-[var(--secondary)]/10 p-2 shadow-sm"
            >
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <Image
                  src={selectedImage}
                  alt={profile.name}
                  fill
                  className="object-contain object-bottom drop-shadow-lg"
                  priority
                />
              </div>
            </motion.div>

            {/* バリエーション画像（設定されている場合） */}
            {photos.variants && photos.variants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 mt-6 overflow-x-auto p-1 scrollbar-hide"
              >
                {photos.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(variant)}
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex-shrink-0 overflow-hidden bg-[var(--primary)]/5 border-2 transition-all cursor-pointer group shadow-sm ${selectedImage === variant ? "border-[var(--primary)]/80 shadow-md scale-105" : "border-transparent hover:border-[var(--primary)]/30"}`}
                  >
                    <Image
                      src={variant}
                      alt={`${profile.name} variant ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* 右カラム：詳細なプロフィール情報 */}
          <div className="w-full lg:w-7/12 flex flex-col gap-10">
            {/* 名前とコンセプト */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-bold tracking-widest mb-4">
                {profile.concept}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-design font-bold text-[var(--foreground)] mb-2">
                {profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-[var(--foreground)]/40 font-design tracking-widest font-light">
                {profile.nameEn}
              </p>
            </motion.div>

            {/* キャッチフレーズと自己紹介文 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[var(--primary)]/10 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-[var(--primary)] opacity-5 transform rotate-12">
                <FontAwesomeIcon icon={faHeart} className="text-9xl" />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[var(--primary)] mb-5 flex items-center gap-2 relative z-10">
                <FontAwesomeIcon icon={faStar} className="text-sm" />
                {profile.catchphrase}
              </h3>
              <div className="relative z-10">
                <p className="text-[var(--foreground)]/80 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-[var(--secondary)]/50">
                  {profile.bio}
                </p>
              </div>
            </motion.div>

            {/* パラメータ（誕生日・身長など）一覧グリッド */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <DetailCard
                icon={faCakeCandles}
                label="Birthday"
                value={profile.details.birthday}
              />
              <DetailCard
                icon={faRulerVertical}
                label="Height"
                value={profile.details.height}
              />
              <DetailCard
                icon={faFaceSmile}
                label="Likes"
                value={profile.details.likes.join(" / ")}
              />
              <DetailCard
                icon={faFaceFrown}
                label="Dislikes"
                value={profile.details.dislikes.join(" / ")}
              />
            </motion.div>

            {/* ファン情報・ハッシュタグ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-[var(--primary)]/5 rounded-2xl p-6 md:p-8 border border-[var(--primary)]/10"
            >
              <h4 className="font-design font-bold text-lg mb-6 flex items-center gap-2 text-[var(--foreground)]">
                <FontAwesomeIcon
                  icon={faUserTag}
                  className="text-[var(--primary)]"
                />
                Fan Info
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-sm text-[var(--foreground)]/50 mb-1 font-bold uppercase tracking-wider">
                    Fan Name
                  </div>
                  <div className="font-bold text-lg md:text-xl text-[var(--foreground)]">
                    {profile.fanName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--foreground)]/50 mb-1 font-bold uppercase tracking-wider">
                    Fan Mark
                  </div>
                  <div className="text-2xl md:text-3xl">{profile.fanMark}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-[var(--foreground)]/50 mb-3 font-bold uppercase tracking-wider">
                  Hashtags
                </div>
                {profile.hashtags.map(({ id, label, tag }) => (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-32 md:w-36 text-xs font-bold text-[var(--primary)] break-keep lg:break-normal">
                      {label}
                    </div>
                    <div className="flex-1 bg-white/80 px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--primary)]/10 flex items-center gap-2 text-[var(--foreground)] shadow-sm">
                      <FontAwesomeIcon
                        icon={faHashtag}
                        className="text-[var(--secondary)] text-xs"
                      />
                      {tag}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 自己紹介動画セクション */}
        {profile.introductionVideoId && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-24 max-w-4xl mx-auto"
          >
            <h4 className="font-design font-bold text-2xl mb-8 flex items-center justify-center gap-4 text-[var(--foreground)] tracking-widest">
              <span className="w-12 h-px bg-[var(--primary)]/40" />
              Introduction Video
              <span className="w-12 h-px bg-[var(--primary)]/40" />
            </h4>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[var(--primary)]/20 bg-black/5 group">
              <iframe
                src={`https://www.youtube.com/embed/${profile.introductionVideoId}?rel=0&modestbranding=1`}
                title={`${profile.name} 自己紹介動画`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--primary)]/40 rounded-tl-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--primary)]/40 rounded-br-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            </div>
          </motion.div>
        )}
      </div>

      {/* リンクセクション（外部コンポーネントを再利用） */}
      <div className="mt-20 relative z-10 border-t border-[var(--primary)]/10">
        <Links />
      </div>
    </main>
  );
}

// プロフィール詳細項目の汎用カードコンポーネント
function DetailCard({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-[var(--primary)]/10 shadow-sm transition-transform hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
      <div>
        <div className="text-xs text-[var(--foreground)]/50 font-bold uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="font-medium text-[var(--foreground)] text-sm">
          {value}
        </div>
      </div>
    </div>
  );
}
