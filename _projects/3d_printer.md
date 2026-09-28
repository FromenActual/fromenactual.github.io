---
layout: post
title: 3D Printer
date:  2020-01-02
thumbnail:
  src: https://www.dryw.xyz/uploads/1/3/8/9/138986771/20200101-153029_orig.jpg
description: A custom 3D printer with a Prusa/Ultimaker-inspired design.
---

# Introduction

Back in 2015, when 3D printing started becoming very popular, I got my first 3D printer. I absolutely loved it and made all sorts of things, from decorative things, to presents for family, to functional parts for my robotics club.

![My first 3D printer](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20151118-201521_orig.jpg)

There's so many unique things you can make with 3D printers! Take this [triple gear](https://www.youtube.com/watch?v=I9IBQVHFeQs) for example, designed by Henry Segerman and Saul Schleimer from 2012. There's basically no way to make this with traditional manufacturing techniques, but 3D printers can do it!

![Triple gear print](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/20190628-111821.jpg?1645308778)

As I learned more about 3D printing over the years, I started to realize my 3D printer wasn't actually all that great. Sure, it could make parts, but they weren't very high quality. If you look closely at the triple gear, you can see a bunch of lines on the gears. Those are not the layer lines, those are bulges every mm or so. In fact, take a look at this test print next to the z-axis lead screw:

![Test print showing bulges lined up with the lead screw](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/20190628-101354.jpg?1645309410)

That lines up perfectly! So clearly the rotation of that lead screw was somehow causing these bulges. I tried chasing it down for a while, but never managed to fix it. And there were other problems too. It was really loud, parts didn't stick to the bed very well, the bed wasn't flat, dimensional accuracy was low, etc. It was time for a new printer.

Rather than buying a new one, I decided to build one from scratch! Then I could fully customize it how I like, it would be cheaper than buying one (I was wrong about that!), and it would be a fun experience. And I had enough experience from other projects that I felt comfortable taking on this challenge, so I got to work designing!

# Motion System

There were 2 printer companies that inspired my printer design: Prusa, and Ultimaker. Both make good quality printers, but there's some pretty big differences in their designs. The most prominent is the motion system: Ultimaker's extruder moves in the X and Y axes, whereas Prusa's extruder moves in the X and Z axes. The bed moves in the third axis.

With 3D printers, it's typical for the X axis to be left/right, the Y axis to be forward/backward, and the Z axis to be up/down. So with Prusa's design, the bed moves a lot. I'm not really a fan of this arrangement, because it has a much bigger footprint. Suppose the bed is 1ft long; this means you need at least 2ft of space for the printer. Another problem is that the bed is relatively heavy, so moving it around causes vibrations that appears as artifacts on the printed object.

![Prusa i3 printer with moving bed](https://www.dryw.xyz/uploads/1/3/8/9/138986771/prusa-i3_orig.jpg)

In contrast, Ultimaker's printers only move the bed up/down. This means the overall footprint is about the same size as the bed, and there's fewer artifacts on the print due to vibrations. There can still be vibrations caused by the extruder moving around, but it has a much lower mass than the bed, and therefore smaller vibrations.

![Ultimaker 2 printer](https://www.dryw.xyz/uploads/1/3/8/9/138986771/ultimaker-2_orig.jpg)

So I decided that my printer should have the extruder move in the XY axes, and the bed in the Z axis. The smaller footprint also means that it's easier to enclose the build chamber, which is useful for materials that require higher temperatures. Now came the question of how to move each axis.

There's really 2 main ways of moving axes in machines like these: lead screws, and belts. Lead screws are just threaded rods; there's a nut attached to the moving assembly, and as the screw turns, it pushes/pulls the assembly. With belts, there's something on the moving assembly that grabs the teeth of the belt, which is run in either direction by a motor with a pulley. Belts tend to be faster, and can be moved by hand while the motors are unpowered.

Anything moving up/down has to fight gravity, so it's pretty typical to use lead screws for the Z axis. If belts were used, there would be nothing to stop it from falling when the motors are turned off. Lead screws also allow for finer resolution, which is especially important when setting the nozzle height for the first layer. So the bed would definitely use a lead screw, but where would it go?

Ultimaker uses a cantilevered design, where the lead screw and guide rods are on the back side of the bed, and there's no other supports. This means the bed actually droops a small amount on the front side, and it's prone to flexing during fast movements. In reality it's not much, but it does need to be accounted for. One solution is actually to use 4 lead screws, one in each corner of the bed. However this adds complexity, requiring either 4 independent motors, or some mechanical connection to a single motor.

I knew that I was going to use a Z probe (more on that later) to compensate for any variations in the bed, so I decided to go with the cantilevered design. It's the simplest design I can think of, and I like simple solutions. And because the Z axis hardly moves, I wasn't concerned about it flexing. This is the final design I created for the Z axis:

![Final Z axis design](https://www.dryw.xyz/uploads/1/3/8/9/138986771/bed-axis_orig.png)

Now for the XY axes. The challenge here is allowing the extruder to move in both X and Y simultaneously. One solution is to isolate each axis from each other, where the extruder moves along a carriage in the X axis driven by a motor. Then the whole carriage moves along the Y axis with another motor, meaning the extruder can go anywhere in the XY plane. One downside is that the carriage is relatively heavy, meaning the Y axis motor has to work harder, and vibrations are more likely due to more mass.

There's a cool version of this implementation, which is called [CoreXY](https://corexy.com/theory.html). Both the motors are stationary, which significantly reduces the mass of the carriage. The motors move the axes with belts and a number of pulleys to route the belts. In this implementation, both belts actually connect to the extruder. As one belt moves, the carriage moves in the Y axis while the extruder moves along the X axis at the same rate. This causes the total extruder motion to be diagonal. The other belt causes the extruder to move along the other diagonal direction. To move in an orthogonal direction, both motors spin at the same speed.

![CoreXY belt routing diagram](https://www.dryw.xyz/uploads/1/3/8/9/138986771/corexy_orig.png)

I think this is a really clever and simple solution, but it's not what I ended up using. There's another solution that Ultimaker uses on their printers called a crossed gantry (you can see it in the image above). The extruder hangs on 2 perpendicular rails in the middle, then ends of which are attached to blocks. These blocks slide along some rods, and are pulled by belts in the X and Y axes. Moving the blocks moves the extruder in the same direction.

![Crossed gantry diagram](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/crossed-gantry.png?1645320346)

One challenge with this configuration is that blocks on opposite sides need to move in the same way. This is the really clever part: the belts are connected to pulleys on the rods, which mechanically connect the opposing belts and make them move in the same way! I just think this is super clever, because the rods serve 2 functions: connecting the belts, and providing something for the blocks to slide along. The novelty of this design really won me over, which is why I ended up building it. This is the final design I created:

![Final XY axis design](https://www.dryw.xyz/uploads/1/3/8/9/138986771/xy-axis_orig.png)

So my motion system ended up being basically the same as the Ultimaker design. After evaluating different options myself, I can see why Ultimaker has gone with this arrangement. I'm not sure why Prusa uses a moving bed design, it could just be that it's easier to build or something. Regardless, they're still fantastic printers. For anyone looking to buy one, I always recommend Prusa printers, you get such great value for a very reasonable price in my opinion.

I should also mention that cartesian motion systems are not the only solutions. Another somewhat popular alternative is the delta configuration, where the extruder is moved by 3 separate arms that slide up and down. One that's even less common is the SCARA design, which is basically an extruder on the end of a robot arm. Both of these require some complicated inverse kinematics, which I wasn't prepared to figure out!

# Frame

Now that I'd decided on a motion system, I needed some way to support all the parts. This was fairly straightforward, it's just a handful of aluminum extrusions connected together in a box shape. This seems to be fairly common with custom 3D printer designs, because it provides a very rigid structure with lots of mounting points along the edges. Here's what it looks like in the final design:

![Aluminum extrusion frame](https://www.dryw.xyz/uploads/1/3/8/9/138986771/frame_orig.png)

The extrusion I chose was the [2020](https://8020.net/20-2020-black-fb.html) profile from 80/20, a company that manufactures aluminum extrusion and related hardware. Their extrusion is pretty reasonably priced, only 22 cents per inch, or 42 cents if you go with black anodization, which I did! And you can get your pieces cut to length for $2 per cut. In total, the frame was 217 inches with 13 cuts, which ended up costing around $100 before shipping and tax.

However pretty much everything else that 80/20 sells is expensive, so I got a lot of mounting hardware from AliExpress for much cheaper. For the mounting brackets in the corners, 80/20 charges like $8 each; I have 18 of them, which would have been around $150! They're just aluminum plates with holes in them! Even worse, they charge like 30 cents per screw and nut! There's a couple hundred fasteners in this whole assembly, that's way too expensive! I definitely save a lot of money by getting those parts from AliExpress, but I ended up paying for it in an unexpected way.

The screws I purchased still had lots of machine oil on them from manufacturing, which I had to clean off before I could use them. Some were really rusty, and I even came across a couple that still had a plug in the socket for the allen wrench, making them unusable.

![Rusty screws from AliExpress](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20190725-095830_orig.jpg)

But that's pretty minor, most were still usable. The real problem came with the T-slot nuts I bought. The idea with these is that they slide along the T-shaped cutout in the extrusion profile. Here's the 2020 profile dimensions:

![2020 extrusion profile dimensions](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20-2020-dimensional_orig.png)

Note that the dimension of the opening on each side is 5.26mm. The nuts I bought were actually 6mm at that point, so they didn't fit. Yay.

I could have ordered some other nuts, but shipping with AliExpress takes a long time. So I instead decided to make the openings of my extrusions bigger. My university had a machine shop with milling machines available for use, which made this pretty easy to do. I just clamped the extrusion in a vice, and ran an end mill down the length of it. Then repeat on all 4 sides of all 13 pieces, and that's it! And because I'd ordered the black anodizing, this resulted in shiny stripes along all the extrusions, which I think actually looks pretty cool!

Also from AliExpress, I ordered a handful of these KP08 bearings to support the rods of the XY axes. These nicely mount straight onto the frame near the top, and are offset in height so the rods don't interfere with each other. Some of them were a little crunchy, but they seemed to get better over time.

![KP08 bearings](https://www.dryw.xyz/uploads/1/3/8/9/138986771/kp08_orig.png)

The XY motors mounted just below with a bracket, and are connected to the rods with a belt.

![XY motor mounting bracket](https://www.dryw.xyz/uploads/1/3/8/9/138986771/xy-motor_orig.png)

As for the Z axis, the support rods are supported by some SK12 clamps at the top and bottom. I later 3D printed a piece to attach the Z motor to the frame.

![SK12 clamps supporting the Z axis rods](https://www.dryw.xyz/uploads/1/3/8/9/138986771/sk12_orig.png)

I made it a requirement that nothing stick out beyond the faces of the frame, because this allowed me to add plastic side panels later to enclose it. I bought some polycarbonate sheets for this from [TAP Plastics](https://www.tapplastics.com/product/plastics/cut_to_size_plastic/polycarbonate_sheets/516), a company that sells all sorts of plastic-based materials. I ordered all the sheets I needed cut to size for about $60. I also had to cut out the corners to make space for the frame brackets and drill mounting holes, but that was easy enough.

Also, quick tangent on plastic sheets - acrylic and polycarbonate are very popular, but I really don't recommend acrylic. It will shatter like glass if you stress it, whereas polycarbonate just deforms. I've also had acrylic crack when drilling holes near the edge, which is really annoying. Both materials cost about the same, so I usually avoid acrylic when I can. If my printer was accidentally kicked or something, I definitely didn't want to break a side panel!

# Extruder

This was probably the most complicated assembly of the entire printer. There's a lot of parts in a very small space, so it was a bit of a head scratcher to make everything fit. Let's go over everything needed on the extruder:

* Motor and feeder
  * This is what pushes the filament into the nozzle. Some designs mount this to the frame with a long tube to guide the filament to the nozzle, which reduces the mass of the extruder assembly. However these tubes introduce backlash, which I wanted to avoid.
* Nozzle and heating element
  * This is what heats up the plastic filament right before it's deposited onto the print. Ideally this is really short to minimize things like stringing.
* Heat sink fan
  * The heat from the heating element would spread to other parts of the extruder assembly that we want to keep cool. This fan keeps everything else from getting hot.
* Part fan
  * With some filaments (like PLA), it's a good idea to cool the extruded material quickly. Otherwise it remains goopy for a long time, which can result in lower quality parts.
* Z probe
  * This measures the height of the bed very precisely at multiple locations. The printer uses these measurements to compensate for any warping in the bed, which helps ensure the first layer sticks well.
* Bearings
  * The rods of the motion system go through these to hold the extruder assembly in place and move it around.

That's a lot! Fortunately I was able to knock several things off this list by buying a pre-manufactured extruder. E3D is a company well known in the 3D printing community, largely due to their work on extruders. At the time I was working on this project, their most popular nozzle was the [Titan](https://e3d-online.com/products/titan-extruder), which includes the motor, feeder, heat sink, heater, and nozzle.

![E3D Titan extruder](https://www.dryw.xyz/uploads/1/3/8/9/138986771/e3d-titan_orig.jpg)

Right after I finished the printer, E3D announced their Hemera extruder. It has a number of improvements over the Titan, and I did consider upgrading to it. But with how much work I'd already put into the extruder assembly, I didn't want to start over! And it works great anyways, so I stuck with it.

Buying this knocked half the items off the list, but I still had to figure out the other half. The first thing I tackled was the heat sink fan. The idea was for a fan to be mounted right in front of the heat sink (the circular fins on the bottom half) with a 3D printed shroud to guide the air past the fins. It connects to the Titan's mounting bracket with a few screws. This shroud also served as a place to connect other parts of the extruder assembly.

![First stage of the extruder assembly with heat sink shroud](https://www.dryw.xyz/uploads/1/3/8/9/138986771/extruder-1_orig.png)

Sandwiched between those, I designed this 3D printed part to hold the linear bearings. I intentionally positioned the bearings up high so the extruder would hang down, ensuring it didn't go up beyond the top face of the frame. I also made sure these were close to the mounting bracket to minimize flexing.

![Extruder assembly with linear bearing mount](https://www.dryw.xyz/uploads/1/3/8/9/138986771/extruder-2_orig.png)

On the right side is where I added the part fan, a 3D printed duct to guide the air to the nozzle, and the Z probe. This is easily one of the most complicated assemblies I've ever created.

![Extruder assembly with part fan, duct, and Z probe](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/extruder-3.png?1645329158)

Once I had all the parts delivered and printed, I worked on assembling it. This turned out to be pretty tricky. I had designed it in a way where some screws were really awkward to reach, some nuts were difficult to grab, and some parts were annoying to get into place. In hindsight, there's a lot of ways I could improve this design, but I eventually finished the assembly. And it looks exactly like the CAD model, so I'm happy with that!

![Fully assembled extruder](https://www.dryw.xyz/uploads/1/3/8/9/138986771/extruder_orig.jpg)

# Print Bed

This was one of the biggest problems with my old printer, it was a bare aluminum bed with a heater on the bottom. Aluminum is really not a good bed material for 3D printers, plastic doesn't really stick to it. Back in the day, there were 3 fairly popular solutions:

* Glue stick
  * Just wipe on a layer of glue stick and let it dry. This created an interface layer that the plastic could actually stick to really well. Sometimes even too well, I've had to forcefully remove several stuck parts.
* Masking tape
  * Add layers of masking tape over the bed until you've covered the whole thing. Again, the plastic sticks to this better than aluminum, but it wasn't really sticky enough for me. I found myself glue stick over the masking tape, which defaults the purpose of it.
* Kapton tape
  * This worked a lot better than the masking tape, and I could even buy large sheets that covered the entire bed in one go! Although its effectiveness wore off after several prints, and I found myself going back to the glue stick. And when the parts stuck too well, I ended up ripping small areas of the tape, which caused issues for any future parts that I printed there.

Nowadays there are much better solutions, and I think Prusa has the best one: a sheet of spring steel, coated in PEI, held down by magnets.

The coating is the primary solution. PEI, or polyetherimide, is a magical material when it comes to 3D printing. When it's hot, plastic sticks to it really well. You could hit your part with a hammer and it wouldn't budge! When it cools down, it completely lets go of the plastic. You could blow on a small part, and it would slide away! Whoever invented this stuff must have sold their soul.

If for some reason the PEI doesn't release your part, that's where the second solution comes in. Like I said, it's a sheet of spring steel, meaning it's flexible! It's held down by magnets, so you can pull it off the printer, flex it downward, and the part peels off the bed! Incredible!

Because Prusa's beds were so fantastic, I used one on my printer. Well, not quite. At the time, Prusa was only selling spare parts to people who actually bought Prusa printers, so I had to get a knock-off version. But it turned out to be pretty good quality, so I've been happy with it.

At this point, I needed some way to attach the bed to the Z axis. On normal Prusa printers, there's a carriage plate that couples the bed to the Y axis. I took inspiration from that, and just bought a large aluminum plate. It's intentionally longer than the bed so I could couple it to the Z axis. There's 2 linear bearings that ensure the bed assembly can only move up and down. The lead screw from the Z motor runs through a nut to control its position. The lead screw is only attached to the motor at the bottom, there's nothing to secure the top of it. The nut does a good job of constraining its position, so nothing else is needed.

![Bed assembly attached to the Z axis](https://www.dryw.xyz/uploads/1/3/8/9/138986771/bed-assembly_orig.png)

Once I had assembled this and started testing, I discovered the weight of the bed assembly was a bit problematic. The Z motor would sometimes skip steps when pushing the bed upwards. I did have the option to increase the current to that motor, but I didn't like that idea. I instead decided to add a spring to offset the gravitational force.

Now I know what you're thinking: the spring force changes as it stretches, so it would be too much force at one end, and not enough at the other! For a normal coil spring, you're absolutely right, and that would be a bad idea. However there's another type of spring: constant force springs!

These are simply strips of spring steel that have been rolled up. As you unroll it, the spring steel tries to roll itself up again, which exerts a force in opposition to the direction it's being unrolled. And importantly, this force is independent of how far it's been unrolled! This is actually exactly the same way that tape measures automatically roll themselves back in, they're pretty neat! I ordered a couple from [McMaster Carr](https://www.mcmaster.com/springs/constant-force-springs/).

![Constant force springs](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/20191022-195904.jpg?1645333932)

I needed some way to mount these on the bed, so I made a 3D printed part for it. A common solution for constant force springs is to just have them rolled up on a cylinder, and that's what I did on this part. There's a separate cylinder for each spring, with some sloped sides to ensure the springs stay in place. As the springs unroll, they just slide around the cylinders. The rest of this part has some weird geometry in order to clamp around the bed for a solid connection while not interfering with the lead screw or nut.

![3D printed spring holder](https://www.dryw.xyz/uploads/1/3/8/9/138986771/spring-holder_orig.png)

This worked sufficiently well, but I also thought about trying to make the bed assembly lighter. Most of the mass actually comes from the aluminum plate, so I could cut out some sections of it. However I had to be careful, because that plate is the main thing preventing the bed from drooping. I had recently learned about finite element analysis (FEA), which runs a physics simulation to see how much an object deforms when a force is applied to it. There are also optimization algorithms that attempt to reduce one parameter (mass in this case) while maximizing another (stiffness). The SolidWorks license from my university included these features, so I gave it a go! This is what the optimization algorithm came up with:

![FEA topology optimization result](https://www.dryw.xyz/uploads/1/3/8/9/138986771/fea-optimized_orig.png)

Well, that's certainly interesting! Makes me think of an elephant for some reason...

The top is where the Z axis parts are, including the lead screw nut, linear bearings, and springs. The purple dots are the mounting holes for the bed, so those are really the points that need to be supported. What this result shows is there's a lot of unnecessary material in the lower half of the plate between the bed mounting holes. That can all be removed without much effect on the overall stiffness of the assembly.

Obviously this optimization isn't perfect, and it's also not easy to manufacture. But I don't need to use the algorithm's exact result, I can just take the general ideas from it. I made some cutouts in the CAD model that looked a bit more reasonable, and ran the FEA simulation to see how much flex there would be with a 1kg load (basically a really big 3D printed part):

![FEA simulation with simplified cutouts](https://www.dryw.xyz/uploads/1/3/8/9/138986771/fea_orig.png)

That's less than 1mm of deflection at the end! For the stuff I do, that's definitely sufficient. Although I never ended up actually making these cuts in the plate, because the springs did a good job of counteracting the weight. I also wasn't certain how much I could trust the FEA results, and removing the plate from the printer is a bit of a hassle. Still, fun to evaluate anyways!

# Motors

I've not really said much about the motors so far, other than they move the axes and extruder. But I think it's interesting to talk about them, so that's what this section is all about!

There's many types of motors to choose from, so what do 3D printers use? Well, we need to know how far each motor has rotated in order to accurately create stuff, which most motors are incapable of measuring. One option is to add an encoder to the output shaft and run a feedback controller on the main processor, but this is relatively complicated and prone to errors.

There's a better solution: stepper motors! Each motor has 2 coils of wire and a magnet inside (I'm simplifying a lot, but it gets the idea across). The magnet is attached to the rotating shaft of the motor, called the rotor. The coils are attached to the stationary case of the motor, called the stator. The coils are placed 90 degrees apart from each other inside the case. We'll label the coils A and B for clarity. Inside the motor looks like this:

![Stepper motor internal diagram](https://www.dryw.xyz/uploads/1/3/8/9/138986771/stepper-diagram_orig.png)

Suppose we run a current through coil A, creating a north pole near the middle. The south pole of the magnet gets pulled towards it, causing the rotor to spin 90 degrees. Now we turn off coil A and run a current through coil B, creating a south pole near the middle. The north pole of the magnet gets pulled towards that, creating another 90 degree rotation. If we repeat these steps with opposite magnetic fields in the coils, the rotor will have made 1 full rotation.

The advantage here is that we are controlling the coils in these "steps". Each time we make another step, the motor rotates 90 degrees. That's how we know how far the shaft has rotated! We don't need a sensor attached to the output shaft, because if we know how many steps we've taken, we know the angle of the motor! In this configuration, we have 4 steps per revolution.

We can take this a step further too! Suppose in the picture above, we run a current through _both_ coils at the same time! And let's just say both coils create a magnetic north pole near the center. The south pole of the magnet is pulled towards both coils equally, causing it to rotate 45 degrees. Now we have 8 steps per revolution!

We can take this idea even further! Rather than our coils being on or off, we could change the amount of current in each coil. If we put, say, half the current through coil A, then we'd rotate the magnet by about 30 degrees. Or even less current, and achieve 15 degrees, or even smaller. This is called microstepping, and gives us much finer resolution than using full steps.

As I said, this explanation is greatly simplified. In real stepper motors, there are more coils in the stator, and a lot more magnetic poles on the rotor. Take a look at [this one](https://www.pololu.com/product/2267) for example, it has 8 coils and 50 magnetic poles!

![Inside a real stepper motor](https://www.dryw.xyz/uploads/1/3/8/9/138986771/nema-inside_orig.jpg)

Half of the coils are connected to the A wires, and the other half to the B wires, so we still have 4 wires coming out. This stepper has 200 full steps per revolution, or 1.8 degrees per step. In most 3D printers, when a stepper motor is connected to a belt, this results in a resolution of 80 micrometers per full step, or 12.5 steps per mm. This is usually sufficient for 3D printing, but microstepping can easily get us down to 5 micrometers, or 200 steps per mm! That's way more precise than you would ever need from a 3D printer.

Stepper motors are great for knowing how far an axis moved, but only relative to where they started. In reality, the microcontroller in charge of everything doesn't know where the axes are located when it first powers up, so it needs to perform what's called homing. This is where each axis is moved in one direction until it reaches the end. But how does the microcontroller know where the end is?

In most systems using stepper motors, a switch is added to the end of the axis. Something on the moving assembly hits this switch, which sends a signal to the microcontroller to indicate the end.

There's one other thing to be aware of with stepper motors. While there's current running through the coils, the motor is able to exert a torque on the output shaft. So if you try to rotate a powered stepper by hand, it will resist you. But if you've got a good grip, you can actually force it to rotate anyways, causing it to "skip steps". This can also happen on a 3D printer if one axis is physically blocked (eg. the nozzle runs into something) while the motor tries to move. This is very problematic when it occurs, because it creates a [layer shift](https://www.simplify3d.com/support/print-quality-troubleshooting/layer-shifting/) that can completely ruin a print.

![Example of a layer shift](https://www.dryw.xyz/uploads/1/3/8/9/138986771/layer-shift_orig.jpg)

Most 3D printers don't have a way to detect this, so you just have to start the print all over. However, it is detectable! When a skip occurs, the magnet suddenly rotates over to the next full step. If you know anything about magnets moving near coils, you'll know this actually creates a voltage across the coil that we can measure! And that's exactly what Prusa printers do using a stepper driver from [Trinamic](https://www.trinamic.com/products/integrated-circuits/). It closely monitors the voltage on the coils, and if they go out of whack, a step must have been skipped!

Prusa actually uses this skip detection for homing the XY axes. This removes the need for physical switches, which reduces the amount of wiring to do. This can also help with reliability, because those switches can move if they get bumped. I think this is such a cool feature, I made it a requirement for my printer.

# Electronics

By this point I had finished most of the mechanical assembly, and the printer was really starting to take shape! (No, the bed isn't attached in this photo, but this post doesn't actually follow the exact order in which I did stuff anyways. Just imagine it's attached!)

![Printer assembly without the bed attached](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20190728-211406_orig.jpg)

The last major thing to tackle was the electronics. This would control every aspect of the printer, including the motors, heaters, fans, sensors, and user interface. Usually there's one circuit board with connectors for everything, plus the microcontroller and other circuitry needed for interfacing with the components.

For custom 3D printers, it's pretty common to use an Arduino Mega with a [RAMPS](https://reprap.org/wiki/RAMPS_1.4) board plugged into it. The Arduino is the main microcontroller, and the RAMPS board provides connections for all the components, plus a handful of other components like voltage regulators and transistors for high current devices. I could have used this for my printer, however I thought of a better solution.

A lot of my design has been inspired by Prusa printers. My printer uses a Prusa print bed. It uses a Prusa motor for the Z axis. It uses a Prusa Z probe. Why not just use Prusa's main control board? As far as it knows, it's controlling a Prusa printer! All I'd need to do is change some configurations in the firmware, and it should function! This would also save me a lot of set up time, since all the hard work has been done by Prusa with things like skipped step detection.

The control board that Prusa uses is called the [Einsy RAMBo](https://www.prusa3d.com/product/einsy-rambo-mk3s/). It uses the ATmega2560, the same microcontroller as the Arduino Mega. The Trinamic stepper drivers are built right into the board, along with all the voltage regulators, transistors, connectors, etc. It does cost more than a RAMPS board, but it's a nice all-in-one package that saved a lot of headache.

![Einsy RAMBo control board](https://www.dryw.xyz/uploads/1/3/8/9/138986771/einsy-rambo_orig.jpg)

The user interface is handled by another circuit board connected by a cable to the main board. It contains an LCD screen to give the user information, a knob for the user to control the printer, and an SD card slot for storing print files. It also has a buzzer that can alert the user when they're not looking at the printer, and a reset button in case anything goes wrong. Most printers seem to use the same board design, so they're really easy to buy.

![LCD control panel](https://www.dryw.xyz/uploads/1/3/8/9/138986771/lcd_orig.jpg)

And the last major component is the power supply! 12V and 24V systems are most common. Higher voltages are usually more efficient, so that's what I went with. The other important parameter is the maximum power output. Most of the power consumption comes from the bed heater, the nozzle heater, and motors. If everything is running simultaneously, that can easily reach a couple hundred Watts. Just to be safe, I ordered a 400W supply so I had some headroom.

IMPORTANT NOTE - a lot of 3D printers use these industrial style power supplies, which require connection to mains power. This can be dangerous if you don't know what you're doing! I've added a standard power connector and power switch to my printer so I can safely power it up without risk of electrocuting myself. If you're not sure of the proper way to handle this, don't do it!

![400W power supply](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/power-supply.jpg?1645347638)

And that's all the major parts! I was getting really close to actually printing, just a few things left to do! One of which was mounting the final electronics and wiring everything together. Obviously the LCB board needed to be near the front for easy access, so I 3D printed a bracket to hold it at an angle at the bottom. It made sense for the main board and power supply to be at the bottom as well, so that's where those are located. I also mounted the power connector and power switch in the polycarbonate sheet on the side for easy access.

As for wiring, most of the connections came from the extruder assembly. I put some spiral cable wrap around all these wires to make sure they clumped together, and ran the bundle down the back side of the printer to the control board. Some wires were a bit too short, so I spliced in a bit more wire to make them reach. The wires coming off the motors were all separate, so I braided them together to make sure they wouldn't come loose (this also helps with shielding). I also made connections from the control board to the LCB board and power supply.

And that was it! The scary part came next: turning on the power. I had been periodically testing components individually, but never all at once like this. What if I connected something to the wrong place? Or what if I flipped wire polarities somewhere? Or what if the microcontroller suddenly moves all the motors? What if there's an explosion or fire?

I flipped the power switch.

No explosions!!! Yay! I managed to connect everything correctly, and it booted right up with no problems. Woohoo!

# Firmware

As I mentioned, there's some firmware running on the microcontroller that controls everything. In 3D printing, the most commonly used firmware is [Marlin](https://marlinfw.org/). It's an open source project that has been developed to work on basically any 3D printer, which is why it's so popular. There's also many forks of Marlin (thousands, actually!) as people have made their own changes and contributions to it. Prusa has their own fork of Marlin that's used on their Einsy RAMBo boards, so that was my starting point.

From the microcontroller's point of view, my printer is almost exactly the same as a Prusa printer. There were only a handful of differences: the axis lengths were different, the nozzle was in a slightly different location relative to the bed, and the Z probe was in a different location relative to the nozzle. That's really about it, and those values are really easy to change.

In Marlin, there's a couple of .h files that allow you change the configuration of the printer. Just change the numbers, and all the relevant parts of the code automatically update their behavior. Then just flash the microcontroller with the new code, and that's it! I did have to tinker with these numbers a few times, I ran into some weird issues with the Z probe offsets, but I figured it out in the end.

Once those were all set, it was time for the first print! I sliced up a calibration cube and sent it to the printer, and it started printing! Success!

![First calibration cube print starting](https://www.dryw.xyz/uploads/1/3/8/9/138986771/videocapture-20220220-025741_orig.jpg)

Well, not for long. The first few layers were fine, but the cube came off the bed part way through. So I tried again. That one also came off. I tried again. And again. And again. It took until the 6th try for the cube to stick all the way through the print, so that was something to fix. But it can print stuff! And the surface texture is substantially better than my old printer, no more weird bulges on the sides!

![Successful print with much better surface texture](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20191104-102525_orig.jpg)

I think the poor sticking had to do with not printing hot enough, and not having cleaned the bed well enough. Once I'd started dialing in those things, parts were sticking much more reliably.

As I kept printing stuff, I discovered an issue with the XY axes: friction. I don't exactly what's causing it, but I suspect the bearings may not be perfectly aligned with the rods. They have pretty tight tolerances, and I may not have assembled everything as precisely as needed. I did try tinkering with alignment for a while, but couldn't make any improvements. This friction caused 2 major negative effects:

First, the skip detection was getting triggered a lot. The friction was so great that it overcame the torque of the motors. Well, that's one way to verify the skip detection actually works! But obviously that's not good for printing, so I overcame it by increasing the current to the motors. This actually took me a while to figure out how to do. In the firmware, tmc2130.cpp initializes the current settings from a value that's #define'd in the variants folder. I'm not sure exactly what the numbers correspond to, but I just kept increasing them until it stopped getting false positives.

Second, there was relatively high backlash, causing parts to come out undersized. On of my biggest goals was to have a printer than made dimensionally accurate parts, so this really bothered me. I created this test print to quantify it, consisting of a square, and a small nub.

![Test print for measuring backlash](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20200102-000617_orig.jpg)

The backlash wasn't huge, around 0.2mm, but that's enough to cause problems with parts that need accuracy. So I added my own backlash compensation into the firmware. I modified the code that handles G1 commands, which instructs the printer to move the axes. I just added a check to see whether the XY axes were moving in positive or negative directions, and adding or subtracting the backlash amount accordingly. It's really quick and dirty, but worked surprisingly well! The picture above is after I'd implemented the compensation, and my calipers measured 24.00mm on the 24mm circuit. Excellent, that's why I love open source code!

# Results

At this point, I had a fully function 3D printer that I had designed and built from scratch! And it performed a whole lot better than my old printer, so I was really happy with it! Here's a comparison between my new and old printers:

![Comparison between new and old 3D printers](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20191121-001914_orig.jpg)

You may be thinking the new printer looks bigger than the old one. However the new printer actually has a smaller footprint than the old one! That's because the bed moves so far on the old printer that it required much more space along the Y axis. The X and Z axes are actually about the same size on both printers, and the total print volume is about the same.

There was actually one more thing I wanted to add to my new printed: LEDs! Having bright lights near the printer is actually super helpful to ensure it's printing properly, that's something that really annoyed me with my old printer. I designed and printed out these brackets to hold LED strips, which can slot into the extrusions. I printed them in vase mode, meaning there's just 1 wall along the perimeter. This gave them just the right amount of flexibility to snap into the extrusions.

![3D printed LED strip brackets](https://www.dryw.xyz/uploads/1/3/8/9/138986771/led-bracket_orig.png)

Then I got some LED strips, adhered them to the brackets, and wired them up. The final result is awesome!

![Finished printer with LED strips lit up](https://www.dryw.xyz/uploads/1/3/8/9/138986771/20200101-153029_orig.jpg)

Another neat feature of the Einsy RAMBo is that is supports adding a Pi Zero to the back of it for OctoPrint support. I really liked the idea, so I bought a Pi Zero and set it up. It actually worked really well, OctoPrint is a pretty nice interface for using a 3D printer!

I wanted to give the LEDs smart control, where they'd change color based on the state of the printer. For example, it would be white while printing, green when it finished, and red if there was a problem. OctoPrint actually support this through plugins, so I got that set up. And it worked! Having that kind of feedback from the printer is excellent, I wish more printers had stuff like that.

And then I messed it all up by zapping the Pi Zero with 24V. I was fiddling with the LED control circuit while the printer was powered on, and touched a wire to the wrong spot. The Pi Zero was completely dead after that, which made me pretty frustrated. Fortunately the main control board was still fine. Though ever since that happened, I've had intermittent issues with SD cards and USB connections. I suspect some component may have been damaged, but I've got no idea. It works well enough for me to use it regularly, so I've not had to worry about it much, but a replacement main board might help at some point.

And that's about it! I've been using this printer ever since, and it's been great! It is a little rough to use at times, such as parts not sticking, or the printer deciding to reboot in the middle of a print. But overall, it's actually been fairly dependable, and made me enjoy 3D printing again! The problems with my old printer sucked the joy away, so this was a welcome change.

Knowing what I do know, would I build another 3D printer or buy one? Mmm... in all honesty, I would probably just buy one. Don't get me wrong, this was a fantastic learning experience, it's easily one of the most complicated things I've built! But there's also a lot of time and frustration I would have saved if I just bought a printer in the first place. There's definitely a lot of design improvements to be made.

Have you ever built your own 3D printer? I'd be happy to hear about it in the comments below! If you're thinking about building your own, just understand how big of a project it is. I've easily sunk a few hundred hours into this project alone, and you need to have the technical knowledge to address problems that come up. But once it's all said and done, it's a very rewarding experience for sure!
