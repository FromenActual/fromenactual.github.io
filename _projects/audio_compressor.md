---
layout: post
title: Audio Compressor
date:  2022-02-12
thumbnail:
  src: https://www.dryw.xyz/uploads/1/3/8/9/138986771/compressor_orig.jpg
description: Hacky audio compressor for a home sound bar to automatically limit the volume of loud content.
---

# Introduction

We've all experienced the frustration when a movie or show has a very quiet scene that you can barely hear, forcing you to crank up the volume, only for the next scene to blow your ears out without any warning. Well, maybe you like that style of audio mixing because you've got a slick home theater setup without any neighbors to submit noise complaints. But for the rest of us who would prefer to keep our eardrums and not annoy our neighbors, it's quite frustrating at times, always having to be on top of the volume control. If only there were a solution!

Good news, there is! It's called an audio compressor, and a quick Google search shows they only cost... hundreds or thousands of dollars!? And they require a rack mount?? That's not what I'm looking for!

![Google search results for audio compressors](https://www.dryw.xyz/uploads/1/3/8/9/138986771/audio-compressor-google_orig.png)

From my own research, there really aren't any consumer level compressors for sale, at least not that I can find! Everything seems to be either for recording studios or audiophiles, who are already spending loads on high quality audio equipment. But most of us aren't audiophiles, and don't really care to get the flattest response with minimal distortion. Heck, most of us can't tell the difference between a $30 and $3k set of speakers without them being side-by-side.

There are other solutions, of course. The best would be for movies to have a mix for home theater use, but I doubt that will happen any time soon. There's also software solutions, some TVs support features like Roku's "Volume Leveler" on their newer models. However my Roku TV is old enough that it doesn't support that feature. Some AV receivers support that too, but I'm using a cheap soundbar that only has basic volume control. I was feeling a bit hopeless about it, until I remembered that I'm a hobbyist who likes building circuits! So I'll just build one, how hard can it be?

# Circuit Design

I had a basic understanding of how audio compressors work. The audio signal goes through a cable between my TV and soundbar, represented as some changing voltage. All I had to do was splice into that audio cable, add a circuit to measure the voltage amplitude, and use that to control some attenuator for the output. I've built amplitude detector circuits before, but I was less familiar with how to dynamically control the attenuation.

My first instinct was to use some kind of op amp, and somehow change its gain with the amplitude signal. But if you've ever worked with op amps before, you know the gain is set by resistors. Take the classic inverting op amp circuit:

![Classic inverting op amp circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/inverting-op-amp_orig.png)

The gain is given by (V_OUT / V_IN) = (R_F / R_IN). For an audio compressor, we'd need to adjust either R_F or R_IN, but it's not exactly easy to change a resistor's value. I did consider a potentiometer driven by a servo, but that's more work than I thought was reasonable for this project. Some analog circuit should be sufficient, no need to add microcontrollers.

I discovered you can actually buy Voltage Controlled Amplifiers (VCA), which appear to act similarly to op amps, but they've got an additional input for the gain voltage. Sounds like exactly what I was looking for! I even found [this great compressor design](https://mattrottinghaus.com/2017/07/20/analog-compressor-design/) by Matt Rottinghaus that makes use of a THAT 2181, a type of VCA. However I found his circuit fairly complicated and a little hard to follow. I also didn't have that VCA on hand (or any VCA, for that matter), and I wanted to make something with components I had on hand. So I eventually decided again using a VCA, and kept researching alternatives.

I came across [this relatively simple circuit](https://www.youtube.com/watch?v=1h0FZJYXQ_w) from w2aew on YouTube. His circuit uses diodes as attenuators, since their impedance effectively decreases as more current passes through them. After acquiring the signal amplitude, that controls a BJT to drive current through a couple diodes. More volume means more current through the diodes, which means less impedance, resulting in the output level being reduced. His demonstration of the circuit had some excellent results, so I built it on a breadboard.

Unfortunately I wasn't able to get nearly as good results. His video shows the input signal amplitude range from 200mVpp to 3Vpp, and the output amplitude was almost constantly at 40mVpp. When I built the circuit, the output amplitude closely followed the input amplitude until around 1Vpp.

![Diode compressor output at low voltage](https://www.dryw.xyz/uploads/1/3/8/9/138986771/diode-compressor-low-v_orig.png)

Above 1Vpp, I started getting pretty severe distortion of the output. The top of the output waveform started clipping around 0.2V, which is the forward voltage of these diodes.

![Diode compressor output at high voltage showing distortion](https://www.dryw.xyz/uploads/1/3/8/9/138986771/diode-compressor-high-v_orig.png)

I'm not certain why my circuit resulted in wildly different behavior. The fact that the video shows great results indicates I must have built my circuit wrong, or something like that. I've never seen diodes used as attenuators like this before, so I wasn't really sure how to debug it. I decided to keep researching other options.

I came across a page from Elliott Sound Productions describing various [VCA circuit designs](https://sound-au.com/articles/vca-techniques.html). I found most of their circuits to be fairly complicated, and I didn't really understand how a lot of them worked. Then I came across their circuit using an LED pointing at a photoresistor. It's fairly straightforward, and I fully understood how each component was used, so I felt confident in trying to build it.

My initial tests with this VCA circuit had some great results, so I added some components to measure the audio voltage. This is the circuit I ended up with:

![LED and photoresistor VCA circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/vca-circuit_orig.png)

Components D1, C2, and R5 measure the audio amplitude, and store that as a voltage. That then drives the base of Q1, which turns on the LED. The higher the audio voltage, the more the LED turns on. That LED is pointing directly at a photoresistor, whose resistance decreases with more light. It's part of a voltage divider with R2, resulting in the output amplitude being reduced as the input amplitude increases.

This resulted in significantly better results than before! At low amplitude (up to 1Vpp), the output matched the input as desired.

![LDR compressor output at low voltage](https://www.dryw.xyz/uploads/1/3/8/9/138986771/ldr-compressor-low-v_orig.png)

As the input voltage increased beyond 1Vpp, the output amplitude remained roughly constant just like I wanted it to! The only problem was a phase shift in the output, but this was caused by C1. I initially added it to AC couple the output, but later realized it was not needed.

![LDR compressor output at high voltage](https://www.dryw.xyz/uploads/1/3/8/9/138986771/ldr-compressor-high-v_orig.png)

Above about 4Vpp, the LED was fully turned on, so the output amplitude started increasing again. But I was content with that, it's still a fairly substantial reduction in amplitude. Time to hook it up to my TV, right?

Well, no so fast. I'd assumed the audio signal between my TV and soundbar would be in the range of 100mV to a few V in amplitude, and I'd be able to tweak some component values to make this circuit compatible. However the signal level was actually on the order of 1mV to 100mV. The BJT driving the LED doesn't even turn on until 0.4V or so. So I figured the simplest solution was to amplify the input signal with an op amp before measuring its amplitude, then the rest of the circuit remains the same.

​And this actually resulted in very good performance! I spent a while tweaking component values until I got something that worked well for my setup. Here's the final circuit, along with a description of what each section does.

![Final audio compressor circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/compressor-circuit_orig.png)

The input is first AC filtered with C2 and R8, which is then passed to the op amp. D2 ensures this voltage is always positive (or at least above -0.2V) to protect the input of the op amp. Since I'm only using a single supply, this also ensures the input voltage is (mostly) positive so it can actually be amplified correctly.

The op amp is configured as non-inverting, again because I'm using a single supply. The gain is set by 1+(R6 / R7), or about 50x in this case. The amplitude of this amplified signal is then captured by D1, C1, and R1. That then drives a small current through the base of Q1, which turns on the LED, causing the resistance of R4 to decrease. R4 and R5 form a voltage divider, resulting in the output being attenuated.

I was initially using VCC=5V, but discovered the op amp was maxing its output with large signals, and the circuit wasn't able to keep attenuating. I happened to have a 9V supply lying around, so I used that instead and that fixed the problems.

After some thorough testing with my TV, I was very happy with the results! Loud parts of shows are significantly reduced in volume to a much more comfortable level, no need to adjust the volume at all!

# Final Implementation

Until this point, I'd been prototyping on a breadboard. But I wanted something more permanent, so I pulled out my box of protoboards. I spent a while playing with different arrangements until I found something suitable. Here's what the layout looks like:

![Protoboard layout for the audio compressor](https://www.dryw.xyz/uploads/1/3/8/9/138986771/compressor-protoboard_orig.png)

Note that I had to build the circuit twice, since there are left and right audio channels. The LM358 is a dual channel op amp, so I only needed one chip. I also wanted to ensure the photoresistors wouldn't be affected by the LED of the other channel, so I 3D printed some little shrouds to go around each.

![3D printed shrouds around the photoresistors](https://www.dryw.xyz/uploads/1/3/8/9/138986771/compressor-shrouds_orig.png)

I spent the next few hours soldering, and gave it a test on my TV. But there was no attenuation at all! Dang!

Well as it turns out, there's apparently no standard for which side op amp inputs are meant to be placed. I've always been used to the inverting input (-) on bottom, and non-inverting (+) on top, But the circuit design software I'd been using had those flipped, so the inputs were backwards on my protoboard! That wasn't actually a huge problem, I was able to swap those fairly easily. I gave it another test, and...

Success!!! Loud parts are dramatically reduced in amplitude to a comfortable volume, and quiet parts are unaffected, so everything is easy to hear. My main qualitative test was to watch the very first scene of Lost In Space, it starts very quiet, but quickly gets very loud as they crash (oh, uh, spoilers!). Normally I have my TV volume set to around 20% for this show, which is fine for the quiet sections, but sounds like someone's yelling during loud parts. Normally I'd have to reduce the TV volume to below 15% or so to make it tolerable. But now with the audio compressor, I don't have to touch the volume at all! This thing is fantastic!

I have noticed there's a very slight 60Hz buzz coming out of the sound bar. You can't hear it at all when there's sound, but it's faintly there when nothing is playing. I assumed it was an issue with the power supply, so I added some capacitors to VCC, however that didn't really change anything. Interestingly, I discovered that placing the compressor closer to to the TV results in more buzzing than when it's next to the sound bar. I'm not certain what the problem is, it could be a number of things, but it's a small enough problem that I'm just going to leave it. If I get annoyed with it, then I'll look into fixing it.

I wanted to do some quantitative tests too. I hooked it up to a function generator producing a sine wave with variable amplitude and frequency, and measured both the input and output with my oscilloscope. I began with a frequency of 1kHz, and swept the amplitude from 0V to 5Vpp while recording input and output amplitudes. This gave the following response curve:

![Compressor input vs. output response curve](https://www.dryw.xyz/uploads/1/3/8/9/138986771/compressor-response_orig.png)

Up until about 30mVpp, the output matches the input. Between 30mVpp and 300mVpp, the slope of the line is decreased, which is where the attenuation occurs. At 300mVpp, the op amp maxes its output. This prevents the LED from getting any brighter, resulting in maximum attenuation.

The attenuation slope may look subtle on this plot, but keep in mind it's a logarithmic scale. At 300mVpp on the input, the output is reduced to around 70mVpp. That's 4x lower in amplitude, meaning 4x lower volume! And as my qualitative testing showed, it's absolutely sufficient for watching movies and shows.

I also swept through a range of input frequencies to see whether it caused any kind of frequency dependent distortions. Human hearing is typically in the range of 20Hz to 20kHz, so my goal is for that range to have a flat response. And oh boy, is it a flat response! It can go all the way up to 1MHz before seeing any reduction in amplitude. On the low end, it gets to around 5Hz before the output amplitude reduces. I think this is mostly a result of the C2/R8 and C1/R1 pairs acting like high-pass filters, they have a cutoff frequency of just a couple Hz. And there's no audible distortion when watching movies and shows, it sounds just as clear as without the compressor!

I'm planning on creating a box for this to protect it, and to prevent my cat from getting at it. It may also benefit from some metal shielding, that might help with the 60Hz buzzing. If I were to do it again, I would also consider swapping some resistors for potentiometers to dynamically change its behavior.

Overall, I'm very happy with this! I managed to save a heck of a lot of money over buying one of those expensive audiophile compressors. At scale, these could probably be produced for a few dollars each. It did occur to me that I could make these and sell them, but everyone has a different audio setup that I can't control for. So instead, I'm publishing this for anyone to use and modify as you like! If you decide to make one for yourself, let me know how it goes!
