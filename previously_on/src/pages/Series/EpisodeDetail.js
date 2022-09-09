import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth";

export default function EpisodeDetail() {
  const { token } = AuthContext();

  const params = useParams();

  const [Episode, setEpisode] = useState("");
  const [SeriesImage, setSeriesImage] = useState("");

  useEffect(() => {
    async function DetailEpisode() {
      const episode = await axios.get(
        "https://api.betaseries.com/episodes/display",
        {
          params: {
            id: params.id,
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(episode.data);
      setEpisode(episode.data.episode);
      // setSeriesId(episode.data.episode.show.id);
    }

    DetailEpisode();
  }, [params.id, token]);

  useEffect(() => {
    async function fetchImage() {
      const image = await axios.get(
        "https://api.betaseries.com/pictures/episodes",
        {
          responseType: "arraybuffer",
          params: {
            id: params.id,
            key: process.env.REACT_APP_CLIENT_ID,
          },
        }
      );

      const base64 = btoa(
        new Uint8Array(image.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setSeriesImage(base64);
    }
    if (token) {
      fetchImage();
    }
  }, [params.id, token]);

  return (
    <div>
      {Episode && SeriesImage ? (
        <div>
          <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
            <div
              id="profile"
              className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
            >
              <div className="p-4 md:p-12 text-center lg:text-left">
                <img
                  src={`data:;base64,${SeriesImage}`}
                  alt={Episode.title}
                  className="block lg:hidden  shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
                />

                <h1 className="text-3xl font-bold pt-8 lg:pt-0">
                  {Episode.show.title}
                </h1>
                <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
                  {Episode.title}
                </p>
                <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                  Date de diffusion : {Episode.date} | Note :{" "}
                  {Math.round(Episode.note.mean * 100) / 100}
                </p>
                <p className="pt-8 text-sm">{Episode.description}</p>
              </div>
            </div>

            <div className="w-full lg:w-2/5">
              <img
                src={`data:;base64,${SeriesImage}`}
                className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
                alt={Episode.title}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
