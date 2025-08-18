// 기본 음악 이미지들 (public/icons/music/ 폴더의 SVG 파일들 사용)
const DEFAULT_MUSIC_IMAGES = [
  '/icons/music/default1.svg',
  '/icons/music/default2.svg',
  '/icons/music/default3.svg',
  '/icons/music/default4.svg',
];

// 이미지가 없거나 빈 문자열일 때 랜덤 기본 이미지 반환
export const getRandomMusicImage = (imageUrl) => {
  if (!imageUrl || imageUrl === '') {
    const randomIndex = Math.floor(Math.random() * DEFAULT_MUSIC_IMAGES.length);
    return DEFAULT_MUSIC_IMAGES[randomIndex];
  }
  return imageUrl;
};

// 특정 음악 ID에 대해 일관된 이미지 할당 (같은 음악은 항상 같은 이미지)
export const getConsistentMusicImage = (imageUrl, musicId) => {
  console.log(`getConsistentMusicImage 호출: imageUrl=${imageUrl}, musicId=${musicId}`);
  
  // imageUrl이 없거나 빈 문자열이거나 undefined/null이면 랜덤 이미지 할당
  if (!imageUrl || imageUrl === '' || imageUrl === undefined || imageUrl === null) {
    // musicId를 기반으로 일관된 이미지 선택
    const imageIndex = Math.abs(musicId) % DEFAULT_MUSIC_IMAGES.length;
    const selectedImage = DEFAULT_MUSIC_IMAGES[imageIndex];
    console.log(`이미지 할당: musicId=${musicId}, imageIndex=${imageIndex}, selectedImage=${selectedImage}`);
    return selectedImage;
  }
  
  console.log(`기존 이미지 사용: ${imageUrl}`);
  return imageUrl;
};

// 음악 목록에 랜덤 이미지 할당
export const assignRandomImagesToMusicList = (musicList) => {
  console.log('assignRandomImagesToMusicList 호출:', musicList);
  
  const result = musicList.map(music => {
    const musicWithImage = {
      ...music,
      // imageUrl 필드가 없어도 랜덤 이미지 할당
      imageUrl: getConsistentMusicImage(music.imageUrl, music.musicId)
    };
    console.log(`음악 ${music.musicId} 이미지 할당 결과:`, musicWithImage);
    return musicWithImage;
  });
  
  console.log('최종 결과:', result);
  return result;
};
