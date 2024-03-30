// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
// import { useAudioRecorder } from "react-audio-voice-recorder";
// import { LiveAudioVisualizer } from "react-audio-visualize";
// import { useWavesurfer } from "@wavesurfer/react";
// import { stringSimilarity } from "string-similarity-js";
// import { normalizeSentence } from "./utils";
// import { toast } from "sonner";

// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// interface RecordingDataProps {
//   idx: number;
//   label: string;
//   audioBlob: Blob;
// }

// export default function RecordingSession({
//   utterances,
// }: {
//   utterances: string[];
// }) {
//   const wavesurferRef = useRef<HTMLDivElement>(null);

//   const [currIdx, setCurrIdx] = useState(0);
//   const [transcript, setTranscript] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [alert, setAlert] = useState("Start recording");
//   const [similarityIdx, setSimilarityIdx] = useState<number | null>(null);
//   const [recordingData, setRecordingData] = useState<RecordingDataProps[]>([]);
//   const [showResult, setShowResult] = useState(false);

//   const { wavesurfer } = useWavesurfer({
//     container: wavesurferRef,
//     waveColor: "#7f1d1d",
//     height: 125,
//     width: 350,
//   });

//   const {
//     startRecording,
//     stopRecording,
//     recordingBlob,
//     isRecording,
//     mediaRecorder,
//   } = useAudioRecorder({ channelCount: 2 });

//   const handleNext = () => {
//     setShowResult(false);
//     setCurrIdx((prev) => (prev < utterances.length - 1 ? prev + 1 : prev));
//   };
//   const handlePrev = () => {
//     setShowResult(false);
//     setCurrIdx((prev) => (prev > 0 ? prev - 1 : prev));
//   };

//   const onPlayPause = () => {
//     wavesurfer && wavesurfer.playPause();
//   };

//   const handleChange = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.onresult = async (event) => {
//       const text = event?.results[0][0].transcript;
//       setTranscript(text);

//       assessSimilarity(text, utterances[currIdx]);
//     };

//     if (!isRecording) {
//       setShowResult(false);
//       setTranscript("");
//       setSimilarityIdx(0);
//       startRecording();
//       recognition.abort();
//       recognition.start();
//       setAlert("Listening...");
//     }

//     if (isRecording) {
//       stopRecording();
//       recognition.stop();
//       setAlert("Analyzing...");
//       setIsProcessing(true);

//       setTimeout(() => {
//         setIsProcessing(false);
//         setAlert("Click to re-attempt");
//       }, 1000);
//     }
//   };

//   const handleDownload = () => {
//     console.log(recordingData);

//     const zip = new JSZip();

//     recordingData.forEach((data) => {
//       zip.file(`${data.idx}.wav`, data.audioBlob);
//     });

//     console.log(zip);

//     zip.generateAsync({ type: "blob" }).then((content) => {
//       saveAs(content, "recordings.zip");
//     });
//   };

//   const assessSimilarity = (source: string, target: string) => {
//     const similarity = stringSimilarity(
//       normalizeSentence(source),
//       normalizeSentence(target)
//     );
//     setSimilarityIdx(similarity);
//   };

//   // Function to upsert recording data based on idx
//   const upsertRecordingData = (idx: number, label: string, audioBlob: Blob) => {
//     setRecordingData((prevData) => {
//       const existingIndex = prevData.findIndex((data) => data.idx === idx);
//       if (existingIndex !== -1) {
//         // If data with given idx exists, update it
//         return prevData.map((data, index) =>
//           index === existingIndex ? { ...data, label, audioBlob } : data
//         );
//       } else {
//         // If data with given idx doesn't exist, add it
//         return [...prevData, { idx, label, audioBlob }];
//       }
//     });
//   };

//   useEffect(() => {
//     if (!recordingBlob) return;

//     setShowResult(true);
//     wavesurfer?.loadBlob(recordingBlob);

//     upsertRecordingData(currIdx, utterances[currIdx], recordingBlob);

//     toast.success(`Utterance ${currIdx + 1} saved.`);

//     // recordingBlob will be present at this point after 'stopRecording' has been called
//   }, [recordingBlob]);

//   return (
//     <>
//       <div className="text-muted-foreground space-y-1">
//         <div className="flex gap-2 justify-center items-center">
//           {/* <Button variant="ghost" size="icon" onClick={handlePrev}>
//             <ChevronLeft />
//           </Button> */}
//           <span>
//             {currIdx + 1} of {utterances?.length}
//           </span>
//           {/* <Button variant="ghost" size="icon" onClick={handleNext}>
//             <ChevronRight />
//           </Button> */}
//         </div>
//         <p className="text-center text-sm text-muted-foreground">
//           Click the record button and verbalize below sentence.
//         </p>
//       </div>
//       <div className="space-y-4 mb-16 flex flex-col items-center gap-3">
//         <p className="text-3xl font-bold text-balance text-center">
//           {utterances[currIdx]}
//         </p>
//         <div className="flex flex-col gap-8 items-center">
//           {mediaRecorder && (
//             <LiveAudioVisualizer
//               mediaRecorder={mediaRecorder}
//               width={280}
//               height={125}
//               barWidth={1}
//               barColor="#7f1d1d"
//             />
//           )}
//           {!showResult && !mediaRecorder && (
//             <div className="w-[280px] h-[125px] flex justify-center items-center">
//               <div
//                 className={`border transition w-full ${
//                   isProcessing ? "border-mute" : "border-destructive"
//                 }`}
//               ></div>
//             </div>
//           )}

//           {/* <div className="flex justify-center"> */}
//           <div
//             ref={wavesurferRef}
//             className={`transition overflow-hidden ${
//               recordingBlob && !isRecording && showResult ? "h-fit" : "hidden"
//             }`}
//             onClick={onPlayPause}
//           ></div>
//           {/* </div> */}
//           <div className="text-center space-y-4">
//             <button
//               className="group"
//               onClick={handleChange}
//               disabled={isProcessing}
//             >
//               <div
//                 className={`grid place-items-center w-24 h-24 rounded-full border-4 transition ${
//                   isRecording ? "border-destructive" : "border-muted-foreground"
//                 } ${
//                   isProcessing
//                     ? "cursor-not-allowed border-muted"
//                     : "group-hover:border-destructive"
//                 }`}
//               >
//                 <div
//                   className={`w-[72px] h-[72px] bg-destructive transition-all duration-500 ${
//                     isRecording ? "rounded-sm scale-50" : "rounded-[36px]"
//                   } ${isProcessing ? "cursor-not-allowed bg-muted" : ""}`}
//                 ></div>
//               </div>
//             </button>
//             <p
//               className={` text-muted-foreground ${
//                 (isRecording || isProcessing) && "animate-pulse"
//               }`}
//             >
//               {alert}
//             </p>
//           </div>
//           {showResult && (
//             <>
//               <div className="border border-muted rounded-lg px-6 py-4 flex gap-4">
//                 <div className="space-y-1">
//                   <span className="uppercase text-muted-foreground text-xs">
//                     Speech Accuracy
//                   </span>
//                   <p>{similarityIdx && Math.round(similarityIdx * 100)} %</p>
//                 </div>
//                 <div className="border max-h-fit border-muted"></div>
//                 <div className="space-y-1">
//                   <span className="uppercase text-muted-foreground text-xs">
//                     Recommendation
//                   </span>
//                   <p>
//                     {similarityIdx && similarityIdx < 0.7
//                       ? "Consider re-attempting with clear voice and tempo"
//                       : similarityIdx && similarityIdx < 0.95
//                       ? "Decent. You may re-attempt or proceed to the next one."
//                       : "Perfect speech! Redirecting to the next one.."}
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 className="rounded-full space-x-2"
//                 variant="outline"
//                 onClick={handleNext}
//               >
//                 <ArrowRight className="w-4 h-4 animate-pulse" />
//                 <span>
//                   {" "}
//                   {similarityIdx && similarityIdx < 0.7
//                     ? "Proceed anyway"
//                     : "Go next"}
//                 </span>
//               </Button>
//             </>
//           )}

//           <Button onClick={handleDownload}>Download</Button>
//         </div>
//       </div>
//     </>
//   );
// }
