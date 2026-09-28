---
layout: post
title: RFID Scanner
date:  2018-05-01
thumbnail:
  src: https://www.dryw.xyz/uploads/1/3/8/9/138986771/image55_orig.jpg
description: A cheap RFID scanner made with simple electronics.
---

# Introduction

So, self-driving cars are cool, right?

I know, that doesn't sound related to RFID scanners, but trust me, we'll get there! My university required every freshman to take an introductory engineering class, where teams of students are meant to solve an open-ended problem revolving around some theme. When I took the class, the theme was to "improve infrastructure". Yeah, _very_ open-ended!

My team had some long discussions of what exactly we wanted to work on. Somehow we got onto the topic of autonomous vehicles (AV), and we realized that some infrastructure improvements could be made to increase AV reliability. You've probably heard tragic stories of AVs crashing, such as [this example](https://www.businessinsider.com/tesla-drivers-reveal-major-autopilot-flaw-after-model-x-accident-2018-4) where faded lane markers indirectly caused the car to drive straight into a barrier. Obviously some faded lines should never cause an incident like this, but the primary navigation technique is to detect lane markers with a camera. Lane markers get faded all the time, and can even be obstructed by severe weather (rain, snow, etc.), so it's risky to rely on lane markers alone.

Our idea was to add some feature to roads as an alternative navigation solution for AVs. The solution we eventually settled on was to embed RFID tags in the roads under the lane markers. Then RFID scanners on the AVs would pick up the signal from the tags, and by measuring the signal strength, they could determine where they were in the lane. Tags embedded into the road won't fade over time, and they can continue to function even when optical obstructions exist. They could even be programmed with data about the roadway, such as which lane they corresponded to, indicate where a freeway entrance/exit is, etc.

So that's the premise for how this project came to be. I had the most electronics experience in my team, so I was tasked with creating the scanner prototype. All it had to do was read data off the tag, and measure the signal strength. How hard could it be?

# RFID Background

There's a few different RFID standards, but we focussed on low frequency passive RFID. Low frequency in this case means 125kHz, the high frequency stuff goes above MHz range. And we specifically need a passive system, because an active system requires a power source for each tag. If we're embedding millions of these into roads, it's a lot better if they don't require power!

So how does RFID work? I'm glad you asked! Both the scanner and the tag have their own antenna, which is typically a loop of wire acting as an inductor. The inductor is paired with a capacitor to make a resonant circuit, whose frequency is tuned to 125kHz (or whatever frequency is being used). The scanner has its own power source, which it uses to drive the antenna. This is a simplified version of the circuitry antenna:

![Simplified scanner antenna circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image21_orig.png)

The driving signal is a square wave operating at the resonant frequency of the antenna. This causes the output voltage to begin oscillating with a much higher amplitude than the input amplitude, as shown in this circuit simulation:

![Circuit simulation of the oscillating antenna voltage](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image29_orig.png)

Because the antenna is an inductor, this also creates an oscillating magnetic field nearby the antenna. When a tag is brought inside this magnetic field, both antennas act like a transformer, causing a small amount of power to be transferred to the tag. This small amount of energy is sufficient to power a tiny chip on the tag, which has been programmed with data from the manufacturer.

Once the chip has sufficient energy, it transmits its data to the scanner in a clever way. It short circuits its own antenna! This causes the tag's antenna to draw even more power from the scanner's antenna, which results in a small reduction in the scanner's amplitude. Here's a demonstration of this effect on a real scanner antenna with a real tag:

![Oscilloscope trace showing amplitude drop when a tag is present](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image18_orig.jpg)

The nominal amplitude in this case is around 20Vpp, but when the tag shorts its own antenna, it reduces the scanner's amplitude to around 19Vpp. The amount of voltage drop depends on a variety of factors, including the distance to the tag. The duration of this short circuit determines the data that's been transmitted. There are several ways of encoding this data, some common techniques are illustrated here:

![Diagram of common RFID data encoding schemes](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image28_orig.png)

The tags we purchased use Manchester encoding, where "the signal continually alternates between high and low logic states." During a single clock interval, the signal transitions either from low to high, or high to low. The direction of that transition determine whether that bit was a 1 or 0. In the case of these tags, one clock interval is set to 64 oscillations of the antenna, or 512us.

On top of the encoding scheme, there's a protocol used to determine whether the data was transmitted correctly. In the case of these tags, it's the [EM4100 protocol](https://www.priority1design.com.au/em4100_protocol.html):

![EM4100 protocol frame diagram](https://www.dryw.xyz/uploads/1/3/8/9/138986771/em4100_orig.png)

The idea is for the scanner to wait for the header, which is 9 1's in a row. Once the header is received, read and store the rest of the bits in an 11x5 grid. Sum the data bits across the rows and columns, and check whether those sums match the parity bits. If so, the received data is most likely correct. It's still possible for the data to be wrong even if the parity bits check out, but that's beyond the scope of this project.

# Circuit Design

So, the scanner has this oscillating voltage, whose amplitude drops for a few cycles when a tag is present. The duration of that drop determines the data, and the amount of drop determines the distance to the tag. And to keep the project scope in mind, this information should be given to the AV's control software to help it navigate. Sounds like the perfect job for some circuitry and a microcontroller!

The main goal is to detect that drop in amplitude from the antenna. There's a circuit called an [envelope detector](https://en.wikipedia.org/wiki/Envelope_detector) that does this well, consisting of just a diode, capacitor, and resistor.

![Envelope detector circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image48_orig.png)

The idea is that as the input signal comes in, the diode allows the capacitor to charge up until the peak of the signal. Once the signal changes direction, the diode prevents the capacitor from discharging, so that voltage is maintained. We need the capacitor to drain slowly in order to detect lower amplitude oscillations, which is the purpose of the resistor. The diode is intentionally placed in reverse to capture the negative side of this voltage, otherwise the logic on the microcontroller would have been inverted. Here's what the resulting signal looks like in practice:

![Scope trace of the envelope detector output](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image47_orig.jpg)

The capacitor and resistor values are chosen such that this decaying voltage is fast enough to detect the amplitude drops, but not so fast that it catches the drops in the carrier frequency.

This envelope voltage is then put through a high pass filter, which brings the average signal voltage to 0V rather than -10V like before. This also helps filter out any lower frequency signals we don't care about, such as 60Hz from mains power lines.

![High pass filter circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image46_orig.png)

Now we can zoom in on the high pass signal to see what it looks like:

![Zoomed in high pass filtered signal](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image55_orig.jpg)

Looks like a pretty clear signal to me! Although there's some high frequency noise in that blue trace that could cause issues with low signal strength. That can be cleaned up with a low pass filter to make sure we're getting a smooth signal.

![Low pass filter circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image14_orig.png)

That looks like a much cleaner output now!

![Cleaned up signal after low pass filtering](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image35_orig.jpg)

The goal here is to measure the time when those 0V transitions occur, and from that determine what bits were transmitted. The signal doesn't even go above 1V, whereas a microcontroller desires 5V. One simple solution is to use a comparator, which is a device that outputs a high or low logic signal when the input goes above or below some value. It's very easy to set up an op amp for this like so:

![Comparator circuit built with an op amp](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image31_orig.png)

That results in a fairly decent square wave that can be sent straight to a microcontroller!

![Comparator output square wave](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image11_orig.jpg)

That's the data signal sorted, but we need to determine the distance to the tag as well. As stated above, the amount of voltage drop on the antenna depends on the distance to the tag. Well, the signal that we just put into our comparator is a direct measurement of that voltage drop! All we need to do is get the envelope of that, and feed that into the analog input of the microcontroller. However the amplitude is a bit low, so we can amplify it using another op amp:

![Amplifier circuit for the signal strength path](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image19_orig.png)

In this configuration, only the top half of the signal is amplified, but we were going to ignore the bottom half anyways.

![Amplified signal strength trace](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image27_orig.jpg)

Now we just need another envelope detector circuit on this signal like so:

![Second envelope detector for signal strength](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image17_orig.png)

And this does a great job of holding the signal amplitude:

![Signal strength output holding steady](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image40_orig.jpg)

I ran some tests where I moved the tag towards and away from the antenna while watching the output voltage. As expected, moving the tag further away caused the signal strength voltage to decrease. The measurement distance was relatively short, only a couple inches, but it's plenty for a first prototype!

Until this point, I haven't really mentioned what I've been using as an antenna. That's because the antenna has kicked my butt, I definitely don't know much about antenna design! We had ordered a [cheap RFID scanner](https://electropeak.com/learn/interfacing-rdm6300-125khz-rfid-reader-module-with-arduino/) to test with before trying to build our own, and I've just been using the antenna from that for all my experiments. I did make a couple different antennas that do work, they're just not as good as this once. Let's talk about it!

As stated above, the antenna is really just a resonant circuit between a capacitor and inductor. This cheap scanner was capable of reading tags from a couple inches away, but we realistically need a few feet at least. So I figured bigger coil means bigger range, right? I made a couple large coils out of some spare wire I had lying around.

![Handmade antenna coils](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image45_orig.jpg)

I then needed to match a capacitor to each coil to make them resonate at 125kHz. Turns out there's a fairly easy way to find the best capacitor value for this. The circuit below is constructed with some arbitrary capacitor size. A function generator drives the circuit at the desired frequency of 125kHz while measuring the input and output signals.

![Circuit for testing antenna resonance](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image39_orig.png)

There's 3 possible results: the capacitor is too small, too large, or just right. If it's too small, the output signal will be shifted to the right of the input signal (left image below). If it's too big, the output signal is shifted to the left of the input signal (right image below). When the capacitor is just right, the input and output will be aligned with each other, and the output amplitude will decrease (center image below). Ideally the output should be 0V, but there's always some non-zero impedance of the inductor and capacitor.

<div class="gallery" markdown="1">

![Resonance test with too small a capacitor](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image49_orig.jpg)

![Resonance test with the right capacitor value](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image23_orig.jpg)

![Resonance test with too large a capacitor](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image6_orig.jpg)

</div>

I only really tested with the smaller circular coil, it was much easier to work with. I found the ideal capacitance to be 18.5nF, meaning the coil had an inductance of around 87.5uH. Neat!

The next step is to design a circuit that can drive the antenna. The peak current can get quite large, up to 1A in my circuit simulations. That's a lot more than a microcontroller can handle! The solution I found was to use a pair of MOSFETs in a push-pull configuration like so:

![Push-pull MOSFET antenna driver circuit](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image7_orig.png)

M1 is N-channel, and M2 is P-channel. When the gate voltage is at ground, M1 turns off, and M2 turns on. This starts driving current through the antenna, causing the output voltage to rise. Once at the peak, the gate voltage needs to switch to 5V to turn M2 off, and M1 on. This drives current in the opposite direction through the antenna until it reaches the negative peak. This repeats indefinitely. Here's a scope trace of what that looks like in practice for each MOSFET:

![Gate signals for each MOSFET](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image24_orig.jpg)

Because the MOSFETs are driving the antenna at its resonant frequency, the voltage increases far beyond the initial 5V we were supplying. In the case of this antenna, I was able to achieve 50Vpp, that's a 10x increase!

![Antenna output voltage reaching 50Vpp](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image44_orig.jpg)

My simulation showed the antenna drawing up to 1A, however I was only measuring an average of 20mA coming out of my power supply. I suspect the refresh rate of the supply was simply not fast enough to capture the large current spikes, but it's interesting to see such a low average power draw!

Everything was going great until this point. I had a much bigger antenna that was getting over twice the amplitude as the cheap one we'd bought. Surely this must be better, right?

Sadly, no. I connected the antenna to the rest of the circuit, placed a tag in the middle, and saw this on the outputs of the circuit:

![Noisy output signal from the larger antenna](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image34_orig.jpg)

That's a lot more noisy than before! I suspect it may have to do with the high switching current from the MOSFETs. That's not a good sign for a microcontroller, voltage spikes like that can cause instability, or even damage under extreme circumstances. On top of that, the signal strength (blue trace) is much lower than before. With the cheap antenna, the signal strength was around 2.5V, whereas now it's not even 500mV.

Well, who cares if the signal strength is lower, right? We just want a longer read range than 2 inches! Well, here's the output when the tag was placed 2 inches above the antenna:

![Unusable signal when the tag is placed farther away](https://www.dryw.xyz/uploads/1/3/8/9/138986771/image51_orig.jpg)

That is completely unusable. There's no way to grab any useful data from that.

I kept experimenting with it, and got some help from a mentor to try and improve its performance. But we were unsuccessful, this was the best performance we could get from the circuit. I'm sure it's possible to improve the design, but we were out of time by that point for this project. So we just stuck with the antenna from the cheap scanner module since it worked more reliably.

# Microcontroller

Right, that's all the circuit stuff done, now to actually read some tag data! I needed a microcontroller, so I used the hobbyist favorite: Arduino! Specifically the Arduino Pro Mini, because I could stick it into a breadboard, I'm not a fan of loose Uno's flopping around.

Our circuit has 2 outputs: the data signal, and the signal strength voltage. The data signal is digital, making it good for connecting to one of the digital inputs. I specifically chose an input capable of handling interrupts, since I was going to take advantage of that in my code. The signal strength was connected to one of the analog inputs so it could be measured.

I also wanted to add a couple outputs to the breadboard to indicate when data was received and the signal strength, since looking at data from the serial monitor isn't super exciting. I chose to add an LED to indicate the signal strength, and a buzzer to indicate when data was read. These made the breadboard a bit more standalone, only requiring power to actually demonstrate its abilities. And I just barely managed to squeeze everything onto a half size breadboard!

![The finished RFID scanner](https://www.dryw.xyz/uploads/1/3/8/9/138986771/rfid-scanner_orig.jpg)

I would have shared the code here, but that's sadly been lost. Fortunately it's not super complicated logic. The main loop simply measures the signal strength voltage, then sets the LED brightness accordingly. An interrupt is configured on the data pin, which just measures the amount of time since the previous pulse and stores that in an array. Once all 64 bits have been transmitted, the parity bits are checked. If they all check out, the data is logged to the serial monitor, and the buzzer beeps for a short duration. That's pretty much the extent of the code for this project!

# Conclusion

Overall, we were pretty successful in our project! We completed our original goals for this portion of the project, which were to measure the data and signal strength from an RFID tag. We weren't able to get a long range antenna functioning, but the concept is there at least.

At the end of the semester, all the teams presented their projects and got ranked by judges. And my team came second of our class! That's actually exactly what we wanted, because first place winners had to go onto a final judging round the next day, and we didn't really care for it. Perfect!

![Team presenting the RFID scanner project](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20180430-115746_orig.jpg)

![RFID scanner project on display](https://www.dryw.xyz/uploads/1/3/8/9/138986771/img-873364567_orig.jpg)

As I was constructing this scanner, I also realized the student ID cards my school give out use RFID for building access. And it just so happens that they use 125kHz too! I tinkered a bit with trying to read the data off my card, but it was more difficult than these tags we'd bought. Rather than a clock period of 64 cycles, it was more like 8. This makes the carrier frequency harder to filter out, so there was more noise to fight. Additionally, I wasn't really sure what kind of encoding was present and what protocol was used, so I was never able to figure out exactly what data is stored on them. But still fun nevertheless!

A few semesters later, I took another class where my partner and I built a driving robot as our final project. I really wanted to see my RFID scanner in action on a vehicle, so we attached it to the top of the robot. In our code, we implemented a simple line following algorithm based on the signal strength. As a test, I put several tags under a whiteboard, and taped a marker to the robot so it could trace the path. Turned out pretty good!

![Robot tracing a path guided by RFID tags under a whiteboard](https://www.dryw.xyz/uploads/1/3/8/9/138986771/videocapture-20220217-185151_orig.jpg)

That's all I've got from this project! It was definitely a fun one, I really enjoyed learning about how RFID works and being able to create a scanner from scratch. For anyone looking to have their own scanner, it's really a lot easier to just buy a cheap one. But if you decide to build one from scratch, let me know how it goes for you!
