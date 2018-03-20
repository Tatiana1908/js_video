'use strict'

;(function(){

    // 1.play /pause
    // 2. Изменение громкости
    // 3. Измен скорости проигрывания
    // 4. Перемотка видео
        // - по клику на полосу прокрутки
        // - помянув полосу прокрутки
        // - перемотка по клику на кнопки skip
        // - по клику на кнопки <- ->
    // 5. Отображение к-ва пришранного времени
    // 6. Сохранение состояния видео при загрузке

    class Player{
        constructor(element){
            this.player = element;
            this.progress = document.querySelector('.progress');
            this.progress_filled = document.querySelector('.progress__filled');
            this.toggle = document.querySelector('.toggle');
            this.skipBtn = document.querySelectorAll('[data-skip]');
            this.ranges = document.querySelectorAll('.player__slider');
        }
        init(){
            let self = this;

            this.handle_read_player_state();
            this.handle_ranges_state();
            this.dom_events(self);
            this.player_events(self);
        }
        /**
         * don_events добавляем обработчики событий на элементы управления
         * @param {Object} self
         */
        dom_events(self){
            // play/pause Listener
            this.toggle.addEventListener('click', (e) => {
                this.toggle_play();
            });

            this.player.addEventListener('click', (e) => {
                this.toggle_play();
            
            });

            //volume/playbackRate listener on change
            this.ranges.forEach( range => {
                range.addEventListener('change', function(e) {
                    self.handle_range_update(this);
                })
            });
            this.ranges.forEach( range => {
                range.addEventListener('mousemove', function(e) {
                    self.handle_range_update(this);
                })
            });

            //skip listener on click
            this.skipBtn.forEach( btn => {
                btn.addEventListener('click', function(e) {
                    self.handle_skip(this);
                })
            });

            //time update 
            this.progress.addEventListener('click', (e) => {
                this.handle_time_update(e);
            })
        }
        /**
         * player_events добавляем обработчик событий для тега video
         * @param {Object} self
         */
        player_events(self){
            this.player.addEventListener('play', (e) => {
                this.update_toggle_icon();
            });
            this.player.addEventListener('pause', (e) => {
                this.update_toggle_icon();
            });
            this.player.addEventListener('timeupdate', (e) => {
                this.handle_progress_update();
                this.handle_save_state();
            });

        }
        toggle_play(){
            let method = this.player.paused? 'play': 'pause';
            this.player[method]();

        }
        update_toggle_icon(){
            let icon = this.player.paused? '►' : '❚ ❚';
            this.toggle.textContent = icon;
        } 

        handle_range_update(input){
            this.player[input.name] = input.value;
        }
        handle_skip(btn){
            this.player.currentTime += parseFloat(btn.dataset.skip);
        }
        handle_progress_update(){
            let percent = (this.player.currentTime / this.player.duration) * 100;
            this.progress_filled.style.width = `${percent}%`;
        }
        handle_time_update(event_obj){
            let time = (event_obj.offsetX / this.progress.offsetWidth) * this.player.duration;
            this.player.currentTime = time;
        }
        handle_save_state(){
            let state = {
                currentTime: this.player.currentTime,
                volume: this.player.volume,
                playbackRate: this.player.playbackRate
            }
            localStorage.setItem('player_state', JSON.stringify(state));
        
        }
        handle_read_player_state(){
            if(!localStorage.player_state) return;
            let state = JSON.parse(localStorage.player_state);
            
            for (let key in state){
                this.player[key] = state[key]
            }
            
        }
        handle_ranges_state(){
            if(localStorage.player_state){
                let state = JSON.parse(localStorage.player_state);
                for (let i = 0; i < this.ranges.length; i++ ){
                    if (this.ranges[i].name in state){
                        console.log(this.ranges[i].value)
                        this.ranges[i].value = state[this.ranges[i].name];
                    }
                    
                }
                

            } 
        }
    }
let videoTag = document.querySelector ('.viewer')

let player = new Player(videoTag)
player.init();

})();