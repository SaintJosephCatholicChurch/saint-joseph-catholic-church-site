import useLiveStreamUrl from './useLiveStreamUrl';

interface LiveStreamIFrameProps {
  width: number;
  height: number;
  livestreamProvider: 'youtube' | 'facebook';
  facebookPage: string;
  youtubeChannel: string;
}

const LiveStreamIFrame = ({
  width,
  height,
  livestreamProvider,
  facebookPage,
  youtubeChannel
}: LiveStreamIFrameProps) => {
  const livestreamUrl = useLiveStreamUrl({ livestreamProvider, facebookPage, youtubeChannel });

  if (livestreamProvider === 'youtube') {
    return (
      <iframe
        width={width}
        height={height}
        src={livestreamUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <iframe
      src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${facebookPage}%2Flive&show_text=false`}
      width={width}
      height={height}
      style={{ border: 'none', overflow: 'hidden' }}
      scrolling="no"
      frameBorder={0}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen={true}
    ></iframe>
  );
};

export default LiveStreamIFrame;
