class FullScreen {
    public isFullScreen = ref<boolean>(false);

    constructor() {
        this.isFullScreen.value = document.fullscreenElement !== null;
        document.addEventListener("fullscreenchange", () => {
            this.isFullScreen.value = document.fullscreenElement !== null;
        });
    }

    toggleFullScreen() {
        this.isFullScreen.value ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        // this.isFullScreen.value = !this.isFullScreen.value;
    }

}

export default new FullScreen();
