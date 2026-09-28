---
layout: post
title: Tesla Coil
date:  2016-06-05
thumbnail:
  src: https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160605-222335_orig.jpg
  full: true
description: A 3ft tall spark-gap Tesla coil I built in high-school.
---

# Introduction

UNLIMITED POWER!!!

Well, not exactly. But making your own lightning? Absolutely! One of my first major personal projects was a Tesla coil. At the end of my first physics class on electromagnetism, we took a field trip to an electronics museum, and they gave us a demo of a huge Tesla coil. I was fascinated with it, and decided to build one of my own!

If you've never seen a Tesla coil before, all they really do is make big sparks. But there's a lot of cool physics that goes into it, and there's some neat demonstrations you can do.

# High Voltage Safety

Before we go any further, I think it's important to talk about safety here. Tesla coils generate ridiculously high voltages, which could cause major injuries or even kill you. If you don't have a _really_ good understanding of high voltage systems and how to protect yourself, I would recommend against building your own Tesla coil. This post is intended for educational purposes only. I am not responsible for anything you do based on the information I've provided here.

What kind of voltages are we talking about? Well, the outlet in your house is at a couple hundred volts; that's enough to give you serious injuries, or even kill you in some cases. Tesla coils can reach _millions_ of volts, over 1000x higher voltage. Needless to say, they're dangerous!

![Comparison of everyday high voltages](https://www.dryw.xyz/uploads/1/3/8/9/138986771/high-voltage_orig.png)

But wait, when I get a static shock, that's thousands of volts! Why doesn't that kill me?

Right, well uh... it's complicated. The typical warnings you get about high voltage can be... misleading? Again, if you're not _really_ familiar with high voltage, don't play with it. The information provided here is for education, it is _not_ safety training material. But I do think it's an interesting discussion, which what the rest of this section is about. Let's start with some basics.

Voltage really just describes how much energy a charged particle has. The standard unit of measurement is the volt (V), which is equivalent to 1 Joule per Coulomb. A Joule (J) is the standard unit of energy, and the Coulomb (C) is the standard unit of charge.

There are many types of charged particles, but we're mostly going to stick with electrons since that's what actually moves around in wires. Electrons are ridiculously tiny, and likewise have a ridiculously tiny charge. In fact, 1 electron has a charge of 1.6\*10^(-19) Coulombs, less than a quintillionth of a Coulomb.

Suppose you get smacked in the face by an electron with a million volts. How much energy is that? Well, just multiply the voltage by the charge! 1MV times 1.6\*10^(-19) C is 1.6\*10^(-13) J, less than a trillionth of a Joule. For reference, suppose we replace the electron with a housefly going at full speed. You would probably barely notice it, that's around the threshold of what a person can detect. The housefly has a kinetic energy of around 2.4\*10^(-5) J. That's 150 million times more energy than the electron had! There's no way you'd even notice the electron, let alone be harmed by it!

So what does it take to be harmed by electricity? Let's take a look at the example when you get a static shock, since that's more relatable. We need to talk about capacitance, which describes how much charge an object can store. The standard unit of measurement is the Farad (F), which is equivalent to 1 Coulomb per volt. In fact, there's this simple equation that describes the relationship between these values:

![Capacitance equation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/capacitance_orig.png)

So if you have an object with capacitance C that has been given a voltage V, the amount of charge q on the object is just C times V. In the case where you get a static shock, your body is usually charged to a few thousand volts, let's say 5kV so we have a number. And a quick Google search shows your body has a capacitance of around 100pF, or 10^(-10) F, less than a billionth of a Farad. How much charge is that on your body?

5kV times 100pF is 5\*10^(-7) C. That's still a pretty small number, less than a millionth of a Coulomb. However that's way more than just 1 electron, it's actually around 3 trillion electrons! That corresponds to an energy of about 1mJ, or 50 times more energy than the fly had! On top of that, most of those electrons travel through your nerves, because they're much more conductive. This amplifies the amount of pain you that you would otherwise perceive from 1mJ of energy.

Ok, so being charged to a few thousand volts is a bit painful. How come a couple hundred volts from a wall outlet is lethal? Shouldn't that result in less charge, and therefore less energy?

Great question! When we looked at static shocks, that was only a discussion of electrons sitting on your body. Once you got shocked, all those electrons left your body in just a few microseconds, and that was that. However the danger comes from your outlet being able to charge your body repeatedly and very rapidly. Depending on where you live, your mains power oscillates at 50 or 60 times per second. I'm going to stick with 60Hz, since that's what it is at my house.

Suppose you touched a live mains wire. As the voltage rises to a couple hundred volts, your body gets charged up to the same voltage. This gives you a shock. Then the voltage drops until it's a negative couple hundred volts. This gives you another shock. The voltage rises again, giving you another shock, and so on. You're getting shocked 120 times per second!

That's painful for sure, but that's not the really dangerous part. The dangerous part is where those electrons go in your body, with the primary concern being your heart. Normally, your heart gets a small electric pulse a couple times per second that tells it to beat. But if you're getting shocked by your outlet 120 times per second, your heart then tries to beat 120 times per second, which it is not physically capable of doing! That's called ventricular fibrillation, where your heart basically just quivers and doesn't pump any blood. Effects on the heart are the primary concerns around high voltage systems.

But that's not the only danger! So far we've only discussed alternating current (AC), but direct current (DC) systems can be dangerous too! For that discussion, we need to introduce current. It the rate at which charges flow through an object. The standard unit of measurement is the amp, which is equivalent to 1 Coulomb per second.

The danger of DC systems is having a large current travelling through your heart, forcing it to stay contracted and never beat. That occurs when 100mA or so is running through your body.

You may be thinking about your stash of AA batteries, those can easily deliver 100mA! Why aren't those dangerous? That's because there's one more concept we need to introduce, resistance. That describes how much an object prevents current from flowing through it. The standard unit of measurement is the Ohm, which is equivalent to 1 volt per amp. In fact, this is the relationship described by Ohm's Law:

![Ohm's Law equation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/ohm-law_orig.png)

It's really voltage that drives a current through an object, and the amount of current depends on the resistance of that object. Your body resistance is usually around 100kOhm, though that can vary a lot depending on several conditions. Assuming you grab that 1.5V AA battery, that would result in a current of 15 microamps. You wouldn't even feel that, let alone be hurt by it!

So what DC voltage would be lethal? Assuming the 100kOhm body resistance, that would be 10kV. However if something reduces your body resistance, such as being sweaty or having a cut in your skin, even 100V could be lethal!

There's other safety concerns with high voltage systems that I've not covered here, such as burns and neurological effects. But this section is long enough as it is, and should give you a good idea for the dangers involved with high voltages. I personally don't like getting zapped, so I avoid touching anything that cause a shock. With dry skin, you really can't feel anything below 25V or so, so that's my personal threshold. But I also know people who willingly touch stuff at thousands of volts. They aren't stupid by any means, they just have different risk tolerances and don't mind getting zapped. They also take precautions to ensure they won't get severely injured.

Again, the information I've provided here is intended only for educational purposes, this is not safety training material. If this is your first time learning about high voltage systems, I really would not recommend building a Tesla coil. They are fundamentally dangerous machines, and there's lots of safety information I've not included in this post. If you want to know how to build one safely, I'd recommend getting information from an expert, not a blog post on the internet!

TLDR; don't play with high voltage!

# Tesla Coil Physics

The whole idea behind a Tesla coil is to generate a really high voltage. Every electrical insulator has what's called the [breakdown voltage](https://en.wikipedia.org/wiki/Breakdown_voltage), which is where the insulator suddenly becomes conductive. This occurs when the electric field becomes so strong that it starts separating electrons from their atoms, which is no easy feat! In air, this creates free electrons and positively charged ions, which are then accelerated in opposite directions from each other due to the electric field. They crash into other atoms and molecules, causing them to lose electrons too, creating a chain reaction. After just a few microseconds, there's a whole bunch of charged particles flying in opposite directions along a certain path. These events are so energetic that light is emitted along the path. That's what we call a spark!

Every material has a breakdown voltage, and in air, it's around 3 million volts per meter, or 3MV/m. So roughly speaking, if you want to create a spark that's 1 meter long, you'd need 3 million volts (it's actually more complicated, but that's the basic idea). When you get a static shock on your finger, it's typically a couple mm long, which corresponds to a few thousand volts like we talked about in the safety section (don't play with high voltage!).

So how do we generate such a high voltage? Well there's lots of ways to do that, but the solution that Nikola Tesla originally came up with was to use transformers. A transformer is just 2 inductors placed near each other, called the primary and secondary. An inductor is just a coil of wire. When current passes through the primary, it creates a magnetic field around it (which is how electromagnets work!). The really neat thing is that this works in reverse too; a magnetic field can cause a current to flow in the secondary!

Well, almost. It's not actually just a magnetic field that causes current to flow, it requires a _changing_ magnetic field. And it doesn't actually create a current in the inductor, it creates a _voltage_ across the inductor (which can then drive a current). The exact behavior is described by Faraday's Law:

![Faraday's Law equation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/farady_orig.png)

Don't worry if you're not familiar with this notation, it's pretty straightforward! It just says the voltage created across the inductor V depends on 2 things: the number of turns of the inductor N, and how quickly the magnetic field changes inside it (actually magnetic flux, but let's keep it simple). This also works in reverse: the voltage across an inductor creates a changing magnetic field inside it. In a transformer, the inductors are placed so they share the same magnetic field between them.

We're going to do some algebra with this equation. Let's say the primary has voltage V1 and number of turns N1, and the secondary has voltage V2 and number of turns N2. Both inductors share the same changing magnetic field\*, so we can rearrange it to find this relationship:

![Rearranged Faraday's Law for primary and secondary](https://www.dryw.xyz/uploads/1/3/8/9/138986771/farady2_orig.png)

And with a bit more rearranging, we get to the transformer equation:

![Transformer equation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/transformer-equation_orig.png)

\*Actually the field strength in the secondary is less than the primary, so this is not an exact relationship. We can model this with a coupling coefficient between the inductors, but I've omitted it for simplicity.

This equation states that voltage ratio between the primary and secondary is the same as the turn ratio between them. So if we want to maximize V2, we want N2 to be large and N1 to be small. It's pretty typical for Tesla coils to have hundreds or thousands of turns on the secondary, and only 10-20 on the primary. Technically we'd get higher voltages with fewer turns on the primary, but there's diminishing returns due to resistive energy loss. In typical Tesla coils, this transformer results in tens or hundreds of thousands of volts at the secondary coil output!

But wait, we had talked about millions of volts earlier, how are we not there yet? Well, that's because there's one more trick used to amplify the voltage even more! You remember that big shiny donut at the top of the Tesla coil? That's a toroidal capacitor (often called the top load), and it forms a resonant circuit with the secondary coil. Let me explain:

As discussed in the safety section (don't play with high voltage!), a capacitor is a device that stores electric charges. Similarly, you can think of inductors as devices that stores electric current. Assume there's initially some current in the inductor, and 0 charge on the capacitor. As time progresses, the inductor is pushing more and more charges onto the capacitor. Eventually so much charge builds on the capacitor that the inductor is unable to push any more. At this point the inductor has 0 current, and the capacitor has a bunch of charge on it.

The capacitor then starts pushing those charges back through the inductor in reverse. Eventually all the charge has left the capacitor, and the inductor has a negative current through it. This forces a negative charge to accumulate on the capacitor until the inductor can't push any more, at which point the capacitor start pulling a positive current back through the inductor.

This cycle repeats itself, which is why it's called a resonant circuit. It's a lot like when you're on a swing; the inductor current is analogous to how fast you move at the bottom of the swing, and the capacitor charge is analogous to how high you are at the top of the swing.

On a swing, you can go higher by having someone push you, but they have to push you in the right way. Specifically, they have to push you forwards while you're going forwards, otherwise you'll actually lose height. So if you're swinging once per second, they need to push you once per second as well.

Similarly, we can "push" the resonant circuit in the right way to amplify its output. In this case, we're "pushing" the circuit by putting current through the primary, which increases the current in the secondary. If done correctly, this is what pushes Tesla coils to millions of volts. But we need to do this at the right frequency, so we need to know the resonant frequency of the circuit. That's given by this equation:

![Resonant frequency equation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/lc-frequency_orig.png)

L is the inductance, and C is the capacitance. Tesla coils typically have a secondary inductance of 10-100mH, and a toroid capacitance of around 10-100pF. This usually results in a resonant frequency of 100kHz - 1MHz.

And that's the basic theory of Tesla coils! It's really just a transformer driven at its resonant frequency. This creates a ridiculously high voltage on the capacitor, which cases the air to break down, resulting in a big spark. So all we need to do is drive the primary coil at the resonant frequency, how hard can that be?

# Circuit Design

Well, it's not the most trivial problem to solve. Keep in mind the transformer equation, we need a relatively high input voltage if we want a ridiculously high output voltage. And how do you control high voltage electronics?

One of the simplest solutions is the spark gap Tesla coil. The idea is to make another resonant circuit with the primary coil by connecting a capacitor to it. The capacitance has to be chosen so both circuits have the same resonant frequency. One more component is added to the circuit: the spark gap. This is just 2 metal pieces placed a short distance apart from each other. When the voltage across the gap becomes large enough, the air breaks down and allows current to flow through. It's like a switch that only closes once a certain voltage has been reached.

![Spark gap Tesla coil circuit diagram](https://www.dryw.xyz/uploads/1/3/8/9/138986771/spark-gap-circuit_orig.png)

The idea in this circuit is to charge C1 until the spark gap activates. This completes the circuit between L1 and C1, so they start resonating as described before. And because it's the same resonant frequency as L2 and C2, that creates the ridiculously high voltage, resulting in a large spark from the Tesla coil. Each time C1 is charged up, that creates another large spark from the Tesla coil.

Great, so all we need is a high voltage to charge up C1! But wait, our original goal was to create a high voltage, isn't this just moving the problem?

Not quite! Our original goal was to create a _ridiculously_ high voltage, but now we just need a _very_ high voltage! We don't need millions of volts, just enough to create a spark in the spark gap. The separation is a few mm, meaning we only need a few thousand volts to create that spark. For this, we can use another transformer that's connected to mains power.

Rather than building yet another transformer, it's really common to use a neon sign transformer. Microwave oven transformers are popular too, though they're not always as good for Tesla coils, and there's some safety hazards around taking apart microwave ovens (don't play with high voltage!). These increase the mains voltage from a couple hundred volts to around 10-20kV, which is just what we need for the spark gap!

Putting it all together, here's what the final circuit looks like:

![Full Tesla coil circuit diagram](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tesla-circuit_orig.png)

Now that we've created the circuit from end to start, let's walk through it from start to end. Mains power from an outlet (120V/60Hz for me!) powers a neon sign transformer, which outputs power at 15kV/60Hz. As it the output voltage increases, capacitor C1 is charged up. When the output reaches the 15kV peak, the air in the spark gap breaks down, allowing the capacitor to discharge itself through the primary coil L1. This forms a resonant circuit that oscillates at 100kHz, and thereby creates an oscillating magnetic field from L1. This magnetic field creates a voltage across the secondary coil L2, which charges up the toroid C2. Because the magnetic field oscillates at the resonant frequency of L2 and C2, the voltage on the toroid becomes larger and larger until the air eventually breaks down, resulting in a very large spark! And all that finishes before the transformer reaches its negative peak, at which point the whole cycle repeats.

Well, that's quite a lot of theory for a circuit that consists of only 6 components, eh? Let's take a look at how I actually built my first Tesla coil!

# Construction

At the time when I started this project, I understood the theory pretty well, but didn't really have a good idea of how to actually build one. I did some extensive research, and found a couple websites in particular to be very helpful. The first is [hvtesla.com](http://www.hvtesla.com/index.html), and the other is [Loneoceans Laboratories](https://www.loneoceans.com/labs/about/), both of which have very thorough documentation and explanations of how to build Tesla coils. There were many other resources I came across in my research, but I'm unfortunately not able to find them any more. Regardless, there's many more resources available now than when I made my Tesla coil.

The first piece I tackled was the secondary coil. A common technique I came across was to buy a spool of magnet wire, and wrap that around a PVC pipe. My design required a 4" diameter, so I bought one from Home Depot. This actually made for a challenge of its own, because those pipes were only sold in 10ft sections, and I couldn't transport that in my Toyota Camry. The staff said I could have it cut to length at the store, but they wouldn't do it for me. They gave me a saw and told me to go at it. Felt pretty weird chopping up a pipe with other customers walking by me, but I got what I needed in the end!

One of the mentors from my FIRST Robotics club offered for me to use his lathe to wind the magnet wire, which saved a lot of time! And I managed to order exactly the amount of magnet wire needed, the spool ran out just as we got to the final length. And it turned out beautifully, there were no major defects to speak of. I ended up gluing the ends of the wire to the pip to prevent it from unraveling.

![Wound secondary coil on PVC pipe](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160424-155251_orig.jpg)

There was one more step to finish the secondary: polyurethane. The main purpose of this is to prevent sparks between the windings of the coil. Let's do a quick estimate: a Tesla coil is capable of around 1MV at its top. There are around 1000 windings on the secondary coil. That means there's around 1kV between each winding, which could result in a short! Magnet wire has an enamel coating that can withstand around 1kV before it breaks down, or 2kV in this case because there's 2 layers of enamel between each wire. But that's still pretty close for comfort, some extra insulation can't hurt. The polyurethane helps increase this breakdown voltage a bit, but also prevents the enamel getting worn down from scratches and scuffs.

That's the secondary coil down, next I decided to work on the toroid. This was arguably the most tedious part of the whole project, it took over 2 weeks for me to complete. Obviously I wasn't working on this full time during those 2 weeks, but it was many hours of labor. But the end result was pretty awesome, definitely worth it!

First off, why a toroid? Well, it doesn't have to be! Many Tesla coils are built with a sphere instead, since that's a lot easier to build. However the electric field becomes stronger in regions of high curvature (that's how lightning rods work!), which we can use to control where the sparks come off the Tesla coil. A sphere has a constant curvature everywhere, meaning the sparks come off in every direction. However a toroid has the greatest curvature along the outside surface, meaning the sparks mostly shoot out sideways. That helps prevent the main sparks from hitting other parts of the Tesla coil, but it also just looks way cooler!

Ok, so how do you build a toroid? One common solution is to wrap some flexible tube around a cylindrical object. In my case, I found an aluminum dryer duct at Home Depot, and some aluminum pie pans at Safeway that ended up working really well together.

![Aluminum dryer duct and pie pans for the toroid](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160508-203455_orig.jpg)

However there's one slight problem. The dryer duct is a pretty bumpy surface, meaning it has pretty high curvature. However we want low curvature, otherwise it discharges early, resulting in shorter sparks. So that surface needs to be smoothed out. My solution was to add layers of Bondo, an automotive body filler, and sand it down until smooth.

![Toroid coated in Bondo body filler](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160512-095338_orig.jpg)

This smoothing process is what took the longest to complete. The first few layers filled the majority of the cavities, but it was still pretty rough. The general process was to mix up a small batch and spread it on. Wait for it to cure, then sand down any large bumps. Then repeat several times.

![Sanding the toroid smooth](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160521-181225_orig.jpg)

After a few days, I was finally getting a smooth surface, but there were still lots of small holes that had to be filled in. More Bondo, more sanding, and I eventually had a very smooth surface that the cat approved of!

![Smooth toroid with cat approval](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160521-221944_orig.jpg)

But there was one more step to do: make the surface conductive. For this, I wrapped the toroid in aluminum foil tape. I got a 2" wide roll, but discovered the aluminum wrinkled at the outer surface. So I cut each strip in half, which did a great job at preventing wrinkles from forming. It also did a great job of making this step take twice as long! This was another couple days of work, just adding strips of aluminum tape and smoothing them down. But the end result was excellent, very smooth with no noticeable bumps anywhere.

![Toroid wrapped in aluminum foil tape](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160528-123654_orig.jpg)

The next major component was the primary coil. It's common for these to have relatively high currents pass through them, requiring thicker wires. I'm not sure why, but copper tubing seems to be the material of choice for Tesla coil primaries. Without questioning it any further, I bought a spool.

The primary coil is typically a flat spiral, and I'm still not really sure why that's the most common shape. But never mind that, I needed some way to mount the tubing. I had a mentor help me make a jig consisting of 6 plastic bars, each with notches cut out at regular intervals. I then spent a few hours shaping the tube to fit the desired spiral shape, with some useful feline help of course!

![Shaping the copper tubing primary coil](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160516-214755_orig.jpg)

Once complete, I mounted this onto a sheet of HDPE, and it was really starting to come together!

![Primary coil mounted on HDPE sheet](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160604-151725_orig.jpg)

The next major component I worked on was the primary capacitor. This was actually several capacitors wired together. The specific model number I used was the 942C20P15K-F (catchy name!), which appears to be another common component used by Tesla coil builders. It's a polypropylene film capacitor rated for 2kV, with a capacitance of 150nF. But if you recall, the transformer has an output voltage of around 15kV, much higher than the capacitor is rated for. That's why there are several wired in series, each capacitor only needs to handle a fraction of the transformer voltage.

The downside of wiring them in series is a loss in capacitance. If more capacitance is needed, it's common to build multiple capacitor banks and put them in parallel. However for my design, only one bank was necessary. That helped save on cost, they're not cheap components!

My design used 20 of these capacitors in series, resulting in a voltage rating of 40kV, and a total capacitance of 7.5nF. I mounted all these capacitors on another sheet of HDPE, each secured by a zip tie.

![Capacitor bank mounted on HDPE sheet](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160528-154253_orig.jpg)

One addition I made to the back side was a bleed resistor for each capacitor. This ensures that when the Tesla coil is turned off, any voltage stored in the capacitors is discharged so no one gets shocked.

![Bleed resistors on the back of the capacitor bank](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160528-154306_orig.jpg)

Only 2 more components to go! And fortunately these were the easiest ones: the spark gap, and the transformer. For the latter, I just ordered a neon sign transformer online, though my wallet wasn't happy about it. The spark gap was constructed from a couple lag bolts in some wooden posts. All 3 of these components (spark gap, transformer, and capacitor bank) we mounted under the primary coil with some plywood and wood posts. And to protect the wood, it was spray painted blue.

![Spark gap, transformer, and capacitor bank mounted under the primary coil](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160606-101911_orig.jpg)

And that's the majority of the work done! Finally, it took over a month to get to this point, but it looks fantastic!

![Fully assembled Tesla coil](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20160605-222335_orig.jpg)

But there's still a few more things to do before it can make sparks. For one, all the components need to be wired up. The wire insulation should be capable of handling the transformer output voltage, since some wires pass right next to each other. Your typical hobbyist wires are usually only rated for 300V or so, which is plenty for a 5V breadboard, but not this! A common suggestion I've seen is to use spark plug wire, which normally connects the spark plugs in your car engine. Those are usually rated for 40kV or so, which is plenty for this application. The guy I talked to at O'Reilly's gave me a weird look when I asked for spark plug wire, but I eventually got what I needed!

At the inside end of the primary coil, the end of the tube was fed through the HDPE sheet to make a connection there. However connecting the other end is not as simple. The exact resonant frequency of the secondary can change in various conditions, meaning the resonant frequency of the primary needs to be adjustable. For this, I used a long spark plug wire with an alligator clip to tap the primary at any location. The optimal location for the primary tap ended up being only a quarter rotation from the end, so I got lucky with the amount of tubing I bought!

Next, I needed a ground plane, for which I ended up using some chicken wire laid on the floor under the Tesla coil. The main purpose of this is to provide a suitable ground connection for the bottom of the secondary. It would be bad to connect it to the wiring in your house, it could seriously affect anything plugged in due to the high voltages.

The last step was adding a power switch. Obviously this needs to be far away from the Tesla coil so you don't get zapped. My solution was to use an old extension cord and splice a light switch into it near the other end. It seems a little sketchy, but it's always worked fine.

After that, the Tesla coil was finally done!

# Results

After adjusting the spark gap distance and finding the optimal primary tap location, I got some fantastic sparks coming out of it! I apologize for the dark and grainy photos below, but it's best to photograph Tesla coils in the dark, and my phone camera wasn't very good in these conditions.

And remember, don't play with high voltage if you don't know what you're doing!

<div class="gallery" markdown="1">

![Tesla coil producing sparks](https://www.dryw.xyz/uploads/1/3/8/9/138986771/videocapture-20220218-015904_orig.jpg)

![Tesla coil sparks close up](https://www.dryw.xyz/uploads/1/3/8/9/138986771/videocapture-20220218-020003_orig.jpg)

![Tesla coil sparks in the dark](https://www.dryw.xyz/uploads/1/3/8/9/138986771/videocapture-20220218-020102_orig.jpg)

![Tesla coil sparks shooting sideways](https://www.dryw.xyz/uploads/1/3/8/9/138986771/videocapture-20220218-015732_orig.jpg)

![Tesla coil in operation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/img-9881_orig.jpg)

![Tesla coil sparks demonstration](https://www.dryw.xyz/uploads/1/3/8/9/138986771/img-9867_orig.jpg)

</div>

With the toroid by itself and nothing around, sparks randomly shoot off in all directions around the toroid. One fun modification is to add a thin metal rod to the toroid, which causes all the sparks to come out from there instead. The reason is that the end of it is sharp, meaning it has a high curvature, resulting in a much stronger electric field at the tip of it.

Another really cool demo with Tesla coils is lighting up fluorescent tubes! These require a high voltage to emit light which is exactly what Tesla coils do! In fact, because Tesla coils create such a strong electric field, the fluorescent tubes can actually light up from several feet away! This is a form of wireless energy transfer, which was Nikola Tesla's original purpose for his creation.

My final physics class had every student create some physics project, and this was my entry! I even got to demonstrate it, and it was definitely one of the favorite projects there!

![Presenting the Tesla coil as a physics class project](https://www.dryw.xyz/uploads/1/3/8/9/138986771/img-9923_orig.jpg)
