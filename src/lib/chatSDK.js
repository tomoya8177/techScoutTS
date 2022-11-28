import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { AGORA_APP_CERTIFICATE, AGORA_APP_ID, AGORA_TOKEN_GENERATOR_SERVEWR_URL } from '../../env';

let channelParameters = {
  localAudioTrack: null, // A variable to hold a local audio track.
  localVideoTrack: null, // A variable to hold a local video track.
  remoteAudioTrack: null, // A variable to hold a remote audio track.
  remoteVideoTrack: null, // A variable to hold a remote video track.
  remoteUid: null, // A variable to hold the remote user id.s
};
let options = {
  appId: AGORA_APP_ID, // Pass your App ID here.
  channel: 'test', // Set the channel name.
  token: '007eJxTYBAsCDzv87qPpYRp4scdS51lvN6/OSnPuvqkiwNDyI0SlUkKDMaJlklJKcYWlibmxibJqalJqUbGiYlpxkmmiYmWycamJUUtyQ2BjAy/vr9lYIRCEJ+FoSS1uISBAQAvWiBS', // Pass your temp token here.
  uid: 0, // Set the user ID.
  ExpireTime: 60, // Set token expire time.
  serverUrl: AGORA_TOKEN_GENERATOR_SERVEWR_URL, // The base URL to your token server.
};

// Fetches the <Vg k="VSDK" /> token
async function FetchToken(uid) {
  return new Promise(function (resolve) {
    axios
      .get(options.serverUrl + '/rtc/' + options.channel + '/1/uid/' + 1 + '/?expiry=' + options.ExpireTime)
      .then((response) => {
        console.log(response.data.rtcToken);
        resolve(response.data.rtcToken);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
  // When plugging in a device, switch to a device that is newly plugged in.
  if (changedDevice.state === 'ACTIVE') {
    localAudioTrack.setDevice(changedDevice.device.deviceId);
    // Switch to an existing device when the current device is unplugged.
  } else if (changedDevice.device.label === localAudioTrack.getTrackLabel()) {
    const oldMicrophones = await AgoraRTC.getMicrophones();
    oldMicrophones[0] && localAudioTrack.setDevice(oldMicrophones[0].deviceId);
  }
};

AgoraRTC.onCameraChanged = async (changedDevice) => {
  // When plugging in a device, switch to a device that is newly plugged in.
  if (changedDevice.state === 'ACTIVE') {
    localVideoTrack.setDevice(changedDevice.device.deviceId);
    // Switch to an existing device when the current device is unplugged.
  } else if (changedDevice.device.label === localVideoTrack.getTrackLabel()) {
    const oldCameras = await AgoraRTC.getCameras();
    oldCameras[0] && localVideoTrack.setDevice(oldCameras[0].deviceId);
  }
};

//init
const agoraEngine = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
// Dynamically create a container in the form of a DIV element to play the remote video track.
const remotePlayerContainer = document.createElement('div');
// Dynamically create a container in the form of a DIV element to play the local video track.
const localPlayerContainer = document.createElement('div');
// Specify the ID of the DIV container. You can use the uid of the local user.
localPlayerContainer.id = options.uid;
// Set the textContent property of the local video container to the local user id.
localPlayerContainer.textContent = 'Local user ' + options.uid;
// Set the local video container size.
localPlayerContainer.style.width = '480px';
localPlayerContainer.style.height = '480px';
localPlayerContainer.style.padding = '15px 5px 5px 5px';
// Set the remote video container size.
remotePlayerContainer.style.width = '480px';
remotePlayerContainer.style.height = '480px';
remotePlayerContainer.style.padding = '15px 5px 5px 5px';
agoraEngine.on('user-unpublished', (user) => {
  console.log(user.uid + 'has left the channel');
});
AgoraRTC.onAutoplayFailed = () => {
  // Create button for the user interaction.
  const btn = document.createElement('button');
  // Set the button text.
  btn.innerText = 'Click me to resume the audio/video playback';
  // Remove the button when onClick event occurs.
  btn.onClick = () => {
    btn.remove();
  };
  // Append the button to the UI.
  document.body.append(btn);
};
agoraEngine.on('user-published', async (user, mediaType) => {
  // Subscribe to the remote user when the SDK triggers the "user-published" event.
  await agoraEngine.subscribe(user, mediaType);
  console.log('subscribe success');
  // Subscribe and play the remote video in the container If the remote user publishes a video track.
  if (mediaType == 'video') {
    // Retrieve the remote video track.
    channelParameters.remoteVideoTrack = user.videoTrack;
    // Retrieve the remote audio track.
    channelParameters.remoteAudioTrack = user.audioTrack;
    // Save the remote user id for reuse.
    channelParameters.remoteUid = user.uid.toString();
    // Specify the ID of the DIV container. You can use the uid of the remote user.
    remotePlayerContainer.id = user.uid.toString();
    channelParameters.remoteUid = user.uid.toString();
    remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString();
    // Append the remote container to the page body.
    document.body.append(remotePlayerContainer);
    // Play the remote video track.
    channelParameters.remoteVideoTrack.play(remotePlayerContainer);
  }
  // Subscribe and play the remote audio track If the remote user publishes the audio track only.
  if (mediaType == 'audio') {
    // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
    channelParameters.remoteAudioTrack = user.audioTrack;
    // Play the remote audio track. No need to pass any DOM element.
    channelParameters.remoteAudioTrack.play();
  }
  // Listen for the "user-unpublished" event.
  agoraEngine.on('user-unpublished', (user) => {
    console.log(user.uid + 'has left the channel');
  });
});
export const initAgora = async (uid) => {
  //let token = await FetchToken(uid);
  await agoraEngine.join(options.appId, options.channel, options.token, uid);
  // Create a local audio track from the audio sampled by a microphone.
  channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Create a local video track from the video captured by a camera.
  channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  // Append the local video container to the page body.
  document.body.append(localPlayerContainer);
  // Publish the local audio and video tracks in the channel.
  await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
  // Play the local video track.
  channelParameters.localVideoTrack.play(localPlayerContainer);
  console.log('publish success!');
};
console.log(agoraEngine);
/*
async function startBasicCall() {
  // Create an instance of the Agora Engine

  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.createElement('div');
  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.createElement('div');
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = options.uid;
  // Set the textContent property of the local video container to the local user id.
  localPlayerContainer.textContent = 'Local user ' + options.uid;
  // Set the local video container size.
  localPlayerContainer.style.width = '640px';
  localPlayerContainer.style.height = '480px';
  localPlayerContainer.style.padding = '15px 5px 5px 5px';
  // Set the remote video container size.
  remotePlayerContainer.style.width = '640px';
  remotePlayerContainer.style.height = '480px';
  remotePlayerContainer.style.padding = '15px 5px 5px 5px';
  // Listen for the "user-published" event to retrieve a AgoraRTCRemoteUser object.
  agoraEngine.on('user-published', async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log('subscribe success');
    // Subscribe and play the remote video in the container If the remote user publishes a video track.
    if (mediaType == 'video') {
      // Retrieve the remote video track.
      channelParameters.remoteVideoTrack = user.videoTrack;
      // Retrieve the remote audio track.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Save the remote user id for reuse.
      channelParameters.remoteUid = user.uid.toString();
      // Specify the ID of the DIV container. You can use the uid of the remote user.
      remotePlayerContainer.id = user.uid.toString();
      channelParameters.remoteUid = user.uid.toString();
      remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString();
      // Append the remote container to the page body.
      document.body.append(remotePlayerContainer);
      // Play the remote video track.
      channelParameters.remoteVideoTrack.play(remotePlayerContainer);
    }
    // Subscribe and play the remote audio track If the remote user publishes the audio track only.
    if (mediaType == 'audio') {
      // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. No need to pass any DOM element.
      channelParameters.remoteAudioTrack.play();
    }
    // Listen for the "user-unpublished" event.
    agoraEngine.on('user-unpublished', (user) => {
      console.log(user.uid + 'has left the channel');
    });
  });
  window.onload = function () {
    // Listen to the Join button click event.
    document.getElementById('join').onclick = async function () {
      // Join a channel.
      await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      // Create a local audio track from the audio sampled by a microphone.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // Append the local video container to the page body.
      document.body.append(localPlayerContainer);
      // Publish the local audio and video tracks in the channel.
      await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
      // Play the local video track.
      channelParameters.localVideoTrack.play(localPlayerContainer);
      console.log('publish success!');
    };
    // Listen to the Leave button click event.
    document.getElementById('leave').onclick = async function () {
      // Destroy the local audio and video tracks.
      channelParameters.localAudioTrack.close();
      channelParameters.localVideoTrack.close();
      // Remove the containers you created for the local video and remote video.
      removeVideoDiv(remotePlayerContainer.id);
      removeVideoDiv(localPlayerContainer.id);
      // Leave the channel
      await agoraEngine.leave();
      console.log('You left the channel');
      // Refresh the page for reuse
      window.location.reload();
    };
  };
}
startBasicCall();
// Remove the video stream from the container.
function removeVideoDiv(elementId) {
  console.log('Removing ' + elementId + 'Div');
  let Div = document.getElementById(elementId);
  if (Div) {
    Div.remove();
  }
}
*/
