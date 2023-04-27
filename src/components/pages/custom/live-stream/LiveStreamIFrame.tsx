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
      src={livestreamUrl}
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
