<script>
  import svelteLogo from './assets/svelte.svg';
  import Counter from './lib/Counter.svelte';
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './pages/Auth.svelte';
  import Auth from './pages/Auth.svelte';
  import { User } from './lib/store';
  import { supabase } from './lib/supabase';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Button from './Atoms/Button.svelte';
  import Projects from './Templates/Projects.svelte';
  import CreateCard from './pages/CreateCard.svelte';
  import DeckPage from './Templates/DeckPage.svelte';
  import Departments from './Templates/Departments.svelte';
  import Department from './Templates/Department.svelte';
  import { initAgora } from './lib/chatSDK';
  import AgoraRTC from 'agora-rtc-sdk-ng';

  let channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a local video track.
    localVideoTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold a remote video track.
    remoteVideoTrack: null,
    // A variable to hold the remote user id.s
    remoteUid: null,
  };
  User.subscribe(async (user) => {
    if (user) {
    }
  });
  var isSharingEnabled = false;
  var isMuteVideo = false;
  onMount(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      User.set({ loggedIn: false });
      //navigate('/auth');
      return;
    }
    console.log(data.user);

    User.set({
      ...data.user,
      loggedIn: true,
    });
    let res = await initAgora(data.user.id);
    document.getElementById('inItScreen').onclick = async function () {
      if (isSharingEnabled == false) {
        // Create a screen track for screen sharing.
        channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack();
        // Stop playing the local video track.
        channelParameters.localVideoTrack.stop();
        // Unpublish the local video track.
        await agoraEngine.unpublish(channelParameters.localVideoTrack);
        // Publish the screen track.
        await agoraEngine.publish(channelParameters.screenTrack);
        // Play the screen track on local container.
        channelParameters.screenTrack.play(localPlayerContainer);
        // Update the button text.
        document.getElementById(`inItScreen`).innerHTML = 'Stop Sharing';
        // Update the screen sharing state.
        isSharingEnabled = true;
      } else {
        // Stop playing the screen track.
        channelParameters.screenTrack.stop();
        // Unpublish the screen track.
        await agoraEngine.unpublish(channelParameters.screenTrack);
        // Publish the local video track.
        await agoraEngine.publish(channelParameters.localVideoTrack);
        // Play the local video on the local container.
        channelParameters.localVideoTrack.play(localPlayerContainer);
        // Update the button text.
        document.getElementById(`inItScreen`).innerHTML = 'Share Screen';
        // Update the screen sharing state.
        isSharingEnabled = false;
      }
    };
    document.getElementById('localAudioVolume').addEventListener('change', function (evt) {
      console.log('Volume of local audio :' + evt.target.value);
      // Set the local audio volume.
      channelParameters.localAudioTrack.setVolume(parseInt(evt.target.value));
    });
    // Set an event listener on the range slider.
    document.getElementById('remoteAudioVolume').addEventListener('change', function (evt) {
      console.log('Volume of remote audio :' + evt.target.value);
      // Set the remote audio volume.
      channelParameters.remoteAudioTrack.setVolume(parseInt(evt.target.value));
    });
    document.getElementById('muteVideo').onclick = async function () {
      if (isMuteVideo == false) {
        // Mute the local video.
        channelParameters.localVideoTrack.setEnabled(false);
        // Update the button text.
        document.getElementById(`muteVideo`).innerHTML = 'Unmute Video';
        isMuteVideo = true;
      } else {
        // Unmute the local video.
        channelParameters.localVideoTrack.setEnabled(true);
        // Update the button text.
        document.getElementById(`muteVideo`).innerHTML = 'Mute Video';
        isMuteVideo = false;
      }
    };
  });
</script>

<main>
  <Router>
    <Route path="/auth/*" component={Auth} />
    {#if $User.loggedIn}
      <Route path="/projects" component={Projects} />
      <Route path="/project/:projectId" component={Departments} />
      <Route path="/department/:departmentId" component={Department} />
      <Route path="/deck/:departmentId/:deckId" component={DeckPage} />
      <Route path="/create-card/:projectId/:deckId" component={CreateCard} />
      <Route path="/create-card/:projectId" component={CreateCard} />
    {/if}
  </Router>
  <button type="button" id="inItScreen">Share Screen</button>
  <button type="button" id="muteVideo">Mute Video</button>
  <br /><label> Local Audio Level :</label>
  <input type="range" min="0" id="localAudioVolume" max="100" step="1" /><br />
  <label> Remote Audio Level :</label>
  <input type="range" min="0" id="remoteAudioVolume" max="100" step="1" />
</main>
