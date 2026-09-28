---
layout: post
title: Brain Tumor
date:  2020-06-05
thumbnail:
  src: https://www.dryw.xyz/uploads/1/3/8/9/138986771/20200605-173108_orig.jpg
description: 3D printing my brother's brain tumor. (He's okay now!)
---

# Introduction

The Fall semester of 2019 had just started, and I was sitting in class when I got a call from my mom. My brother had a brain tumor.

Long story short, everything turned out well! But it was a pretty stressful period, with him needing to have brain surgery to remove it, followed by a few months of chemo and proton therapy to destroy the remaining parts of the tumor.

Of course, he had MRI scans performed so they knew where the tumor was located and how big it was. Here's one of the scans:

![MRI scan of the brain tumor](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/mri.png?1645653884)

It was in the front-left of his brain, and had grown to roughly 7cm in diameter, about the same size as a baseball. That's pretty huge! In terms of volume, that's roughly 1/8th of his total brain, so he's decided to adopted the nickname 7/8. Yeah, he's still the same person :D

As we were looking at the scans, I was thinking it would be cool to have a physical model of his brain with the tumor in it. I was working on my new 3D printer at the time, so I figured I could 3D print it if I could create a 3D model! I asked the staff at the hospital, and they were happy to give us a copy of the MRI scans. I got to work!

# Warning

I've included some images in this post that you may disturbing. There's no pictures of the surgery or anything like that, it's mostly just images and renders from MRI scans. However some of these images and renders can be a bit creepy, I even made myself uncomfortable at times. If you're not comfortable viewing medical images, I'd recommend skipping this post. The content above is enough to get the idea of this project, the rest of this post is just about how I created the 3D model.

# Brain Model

Creating the model was the most difficult part of this project. They gave us a CD with the MRI files on it, so I loaded it up. The CD also contained software to view the MRI scans, which gave me images like the one above. But I needed a 3D model, not pictures.

The MRI viewer allows you to scroll through layers of the scan, in this case from the bottom to the top of the head. My first thought was to grab many of these image layers, then import them into my CAD software (SolidWorks). I could then trace the perimeter of each image, and create a loft feature between each of the layers (a loft just connects 2 different cross sections together). I gave this a test with 2 adjacent layers.

Importing and positioning the images in SolidWorks was easy enough, the hard part was tracing the outside of each image. One option is to manually trace the perimeters, but that would take forever. Fortunately SolidWorks has an autotrace feature, where it evaluates the image to find the edges, and automatically creates lines along those edges. I tried it out, but I wasn't exactly pleased with the results:

![Autotrace result of an MRI layer in SolidWorks](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/autotrace.png?1645655759)

This was about the best I could get. The main problem is that there's no hard boundaries in the image, it's smooth transitions everywhere. Autotracing features like this really don't work well with soft boundaries, so the computed contour is questionable at best.

Regardless, I did the same autotracing with the adjacent layer, and removed all the extra holes inside the main contour. I tried running the loft tool between these 2 sketches, but it refused to create a loft due to the result creating self-intersecting geometry. That's mostly caused by each contour having concave regions in different places due to the autotrace being imperfect:

![Self-intersecting contours from adjacent MRI layers](https://www.dryw.xyz/uploads/1/3/8/9/138986771/contours_orig.png)

I did consider just getting the overall shape without any of the spaghetti texture, but I wasn't content with that. It would have just looked like a ball with a cavity like the Death Star, I wanted the final object to obviously be a brain. I convinced myself that traditional CAD software like SolidWorks wasn't the right solution, so I did some research.

I eventually came across some software called [3D Slicer](https://www.slicer.org/) (not to be confused with Slic3r, the slicing program used in 3D printing) It's a free and open source program used for medical research, and it has the ability to read MRI files and convert them into 3D models! Perfect! I downloaded it and started playing around. It took me a while to figure out what the heck I was doing (actually a couple months of periodically working on it), so here's the outline of the process.

The MRI scans are stored in DICOM files (Digital Imaging and Communications in Medicine). Slicer can load this DICOM data, which first needs to be imported from wherever it's saved on your computer. In my case, the MRI files I had contained multiple scans, so I just select and load them all (again, I didn't really know what I was doing, just found a method that worked for me). Slicer gave me a few warnings and errors about some of the scans, but I just ignored them and had it load what it could.

After loading the DICOM data, Slicer didn't do anything. I expected it to automatically display something, but it turns out you have to manually specify what to view. The top left has a drop down menu for selecting various tools, and I needed to select the View Controllers. Then under each of the slice controllers, I had to specify which scan to view (again, because there were multiple scans), then enable each slice to get the 3D view. Then I could finally see the MRI scans!

![Slicer opened showing the MRI scan slices](https://www.dryw.xyz/uploads/1/3/8/9/138986771/slicer-opened_orig.png)

The sliders on the slice controllers allowed me to sweep through the entire head along each axis, which helped me to visualize it, but that's still not any better than what I had before. That's where I needed a different tool, called Volume Rendering. All I had to do was select on the the MRI scans an enable it, which resulted in a 3D render of my brother's head! Cool!

![Volume rendering of the head from MRI data](https://www.dryw.xyz/uploads/1/3/8/9/138986771/volume-rendering_orig.png)

As you can see, it was pretty fuzzy all around his head. I discovered the Volume Rendering tool has presets available for different types of DICOM data. One of which was for brain MRI scans, so I selected it, and...

AH! CREEPY!

![Creepy volume rendering preset applied to the head scan](https://www.dryw.xyz/uploads/1/3/8/9/138986771/volume-rendering-preset_orig.png)

Where'd his mouth go!? There's a huge cavity there! Looks like something out of a zombie movie! I'm not sure why the MRI didn't capture that area, perhaps because your mouth is a big cavity? Fortunately the Volume Rendering had a crop feature so I could stop looking at his mouth, it was really creeping me out.

That also meant I could look more closely at the brain portion of the scan, and actually see what it looked like in 3D. I set the crop region to remove some portions of the skull so I could actually see the brain. And it looked like a brain!

![Cropped volume rendering showing just the brain](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-cropped_orig.png)

Viewing the scans in 3D is great and all, but I needed a 3D model that I could actually print. As I said before, Slicer has a tool for that, but I first needed to remove everything that wasn't the brain, otherwise it would include other parts of the head. After some more research, I learned that Slicer supports extensions, and there are actually a few specifically for extracting just the brain from the head. The one I ended up using is called [Swiss Skull Stripper](https://www.slicer.org/wiki/Documentation/Nightly/Modules/SwissSkullStripper), which did a good job of removing everything except for the brain.

Once I had it installed, I could select it from the tool drop down in Slicer (under the Segmentation category). I then just had to select a few settings, including the input volume (the same one used for Volume Rendering), and the output volume and mask (I created a new one for each). I'm not sure what the Atlas settings are for, but I just ignored them.

![Swiss Skull Stripper settings in Slicer](https://www.dryw.xyz/uploads/1/3/8/9/138986771/skull-stripper_orig.png)

Once set up, I clicked Apply, and it ran for a minute. Once it finished, I was expecting it to show the brain, but nothing happened. Instead, it creates a new volume (you know, like I told it to!) that I had to manually enable. And it did a fantastic job!

![Brain after being stripped from the skull](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-stripped_orig.png)

As I understand it, the extension generates a 3D mask from the input volume, which it then uses to exclude any parts of the volume that are not contained within the mask. I took a look at the mask out of curiosity, which looks like a piece of voxel art.

![Voxel mask generated by the skull stripper](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-mask_orig.png)

And this is exactly why I didn't want to do this by hand, there's no way I could get that level of detail without losing my mind. (Heh, get it? I'd lose my _mind_ while creating this model of a _brain_? Get it? Get it? Eh, never mind...)

With that, I could finally start creating a 3D model from this! Slicer calls this Segmentation, which is basically where it finds the boundaries of the Volume and creates a solid object from it. This process is actually very similar in principle to the autotracing I used in Solidworks, except it works in 3D and is actually quite decent for this type of object.

It's actually relevant to talk about what exactly MRI scans measure. Without going into the physics, they basically just measure the density of hydrogen atoms. The more hydrogen there is in a certain location, the greater the returned signal value. In the Volume Rendering, this density is represented by the color, where blue is more dense and yellow is less dense. Importantly, different parts of the brain have different densities of hydrogen; the surface noodles have relatively high density, and the tumor has relatively low density.

So when Slicer tries to find the boundaries of the brain, it's really looking at the density of hydrogen at every location and determining whether it's above or below some threshold that I manually specify. If that particular location is more dense than the threshold, it's included in the solid model, and vice versa. Once every location in the Volume has been checked, it creates a solid object that ideally looks like a brain!

To actually do this in Slicer, the Segmentation Editor has to be selected from the tool drop down, then a new Segment is created using the Volume created by the Swiss Skull Stripper. There are several Effects to choose to create and modify Segments, but the first one I used was Threshold. This creates a 3D object using the process I just described, and created this:

![Segmented brain model created with the threshold effect](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-segmented_orig.png)

And that's a 3D model of the brain! I could export this now and send it to my printer, but there are some improvements to be made first. If we take a closer look at the model it created, there are some flaws, especially near the tumor itself. Although the tumor has a lower density of hydrogen, some parts of it have higher density so they were still included. There's also lots of jagged surfaces all around, so these need to be smoothed out.

![Jagged surfaces on the segmented brain model](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-segmented-jagged_orig.png)

Fortunately there's a smoothing tool for this exact reason. There are different smoothing methods, each of which can be tweaked to adjust how much smoothing is applied. And these smoothing operations can be applied multiple times, which can further affect the results. The first operation I used was the joint smoothing, which got rid of most of the mess without filling gaps between the noodles.

![Brain model after joint smoothing](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-segmented-smooth-joint_orig.png)

I then used the opening and closing methods to get rid of any extra floating pieces and cavities in the model. These didn't get everything, but I was planning on cleaning it up manually later anyways.

![Brain model after opening and closing operations](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-segmented-smooth-open-close_orig.png)

After these operations, the model was looking really good! It had the right shape, and all the surface linguini you'd expect a brain to have. Except for the back, that was completely smooth.

![Smooth back of the segmented brain model](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-segmented-back_orig.png)

I think this is caused by the fact that he was lying down during the MRI scan, causing fluids to pool up near the back of the head. I spent a long time playing with all the Segment tools, and I could never get exactly what I wanted. A threshold that's good for the front makes the back smooth. A threshold that's good for the back makes the front very sparse. I eventually decided the best solution was to keep it with the smooth back, since that made the majority of the model look good. I was also planning on cleaning up the model later anyways, so I could also manually carve in the grooves if I really wanted to (spoiler, I did want to!).

Now that I had finally created the model, I needed to export it into a useable format. For objects like this, STL is one of the most common formats (you're probably familiar with it if you've 3D printed stuff). With the Sementations selected from the drop down in Slicer, expand the "Export to files" section. The destination directory and file format can be selected (STL is default), then just click Export.

![Exporting the segmented brain model to STL](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-segmented-export_orig.png)

And with that, ​I had a 3D model of my brother's brain!

# Refining the Model

There's a handful of things I wanted to do to the model before printing it, one of which was some cleanup like I'd talked about before. What I mean by that is just doing things to make it easier to print. Although I used the "closing" tool in Slicer to remove holes, it only removes holes smaller than a certain size. This model still has some relatively large holes inside it, which can't be filled with the closing tool without messing up other parts of the model. So I had to fill these in manually with another program.

I chose Blender for this task, because it's a popular modelling software that has the tools I need for this project. For example, I needed to remove these floating pieces from the tumor:

![Floating pieces in the tumor model](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/brain-outside-floaties.png?1645668720)

My solution was to perform a difference operation with another object. This is one of 3 boolean modifications that Blender supports, with the others being intersection and union. [This page on the Blender website](https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/booleans.html) has a good illustration of these operations between a cube and a sphere:

![Illustration of union, intersection, and difference boolean operations](https://www.dryw.xyz/uploads/1/3/8/9/138986771/blender-boolean_orig.png)

Union (left) basically adds the 2 objects together, intersection (center) keeps only the parts where the objects overlap, and difference (right) subtracts one object from the other). In this case, I used a sphere that I scaled and translated to overlap with the one of the floating pieces.

![Sphere positioned over a floating piece to be removed](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-outside-sphere_orig.png)

After applying the difference operation, the floating piece is removed!

![Floating piece removed after the difference operation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/brain-outside-floaty-removed.png?1645669059)

Similarly, we can use the union operation to fill any holes. I positioned the camera inside the model to view the holes, which you can see in this image. Note that you're seeing the inside faces of the surfaces, so those big blob in the middle are actually big holes in the model.

![View from inside the brain model showing holes](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-inside-holes_orig.png)

Again, I just moved and scaled the sphere so it overlaps with the holes in the model.

![Sphere positioned over holes inside the model](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-inside-sphere_orig.png)

After performing the union, the holes covered up by the sphere were removed!

![Holes filled in after the union operation](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-inside-hole-filled_orig.png)

This is where things got tedious. There's a lot of these little cavities everywhere that needed to be filled for 3D printing. I spent many hours moving the sphere around and performing these union operations to fill everything in. These holes wouldn't have necessarily been a problem for 3D printing, but I wanted the final object to not have any weird defects, so it was worth it for me. And I'm sure there's some other tool I could have used that would have been faster, but this is what I managed to come up with.

However that's not the only tool I used for cleaning up the mode. I also used the sculpting tools to deform and smooth various areas. For example, there were a few areas that had little bits sticking out like this:

![Small artifact sticking out of the model surface](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-nub_orig.png)

Are just more artifacts that the Slicer smoothing tools didn't get rid of, but Blender's sculpting tools made it easy to get rid of them:

![Artifact removed with Blender's sculpting tools](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-nub-removed_orig.png)

Speaking of which, the sculpting tools were exactly what I needed to fix the back of the model!

![Back of the model before sculpting](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-back-hi_orig.png)

It felt very wrong for the back to not have any fettuccini, so I spent a long time manually carving in grooves while referencing the the Volume Rendering in Slicer to make it accurate. I eventually got something I was happy with:

![Back of the model after manually carving grooves](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-back-grooves_orig.png)

And with that, the brain was done! However I wasn't ready to print yet, I wanted to do one more thing.

# Tumor Model

I really wanted to print the tumor as well, and have it slot into the cavity of the brain. So I went back to Slicer and created a new Segmentation. For the brain, I grabbed every part of the MRI scan above some threshold, and this got rid of the tumor. So logically, I could grab every part of the MRI scan below that threshold to get the tumor. This does work, but it also grabs a lot of extra stuff around the edges of the brain.

![Segmented tumor with extra material around the edges](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tumer-segmented_orig.png)

That's where another one of Slicer's tools comes in handy, the scissors. The idea here is to trace out the tumor on each of the perpendicular layer views to remove anything outside of the tumor

![Using the scissors tool on a layer view](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tumor-scissors_orig.png)

This does a good job of removing everything that isn't the tumor, though there are still a few weird bits here and there. Fortunately the scissors tool also works on the 3D view, so you can just rotate the camera to any angle and cut from there.

![Using the scissors tool in the 3D view](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tumor-scissors-3d_orig.png)

After cutting out its shape, the tumor has a pretty jagged surface on the back. After some more smoothing operations, it cleaned up pretty well.

![Tumor model after smoothing](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tumer-segmented-smooth_orig.png)

Once I finished with that, I exported it as another STL and brought it into Blender for more cleanup. And to my surprise, the tumor actually fit into the cavity of the brain really well! It shouldn't really be that surprising, but after all the smoothing operations, I expected the dimensions of the objects would have changed significantly.

![Tumor model fitted into the brain cavity](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tumor-in-brain_orig.png)

Now in reality, I don't think the tumor should actually be as smooth as my model is. However it was really difficult to get anything that wasn't smooth from the MRI scans. Plus I think it helps illustrate that it's not part of the brain, it's something else that doesn't belong. So I actually ended up preferring it having a smooth surface.

I could have finished the models there and printed, but I wanted to do just one more thing. If I printed them as is, the tumor would easily fall out of the brain, which could be annoying. I could have fused the brain and tumor together to prints as one solid object, but I wanted the tumor to be removable. So I decided to create an attachment mechanism so they could be snapped apart and back together again.

Specifically, I thought of making a buckle. I had recently seen [this video from Maker's Muse](https://www.youtube.com/watch?v=tw4iP0luFVU), where he stepped through the process of designing a buckle, and it sounded like the perfect mechanism for my project! I designed this prototype:

![Prototype buckle mechanism](https://www.dryw.xyz/uploads/1/3/8/9/138986771/buckle_orig.png)

The basic idea is that the long arms ar flexible, so they bend inwards as it slides in and out of the receptacle. The nubs at the end hold the buckle in place, but they're relatively shallow so it can be pulled out with just a bit of force. I printed out a test buckle and it performed really well. So I imported both the buckle and receptacle into Blender, and with some more boolean operations, I embedded the buckle onto the tumor, and the receptacle into the cavity in the brain:

![Buckle embedded into the brain and tumor models](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-clasp_orig.png)

Although I later decided it would be better if both the brain and tumor had receptacles, and to print a separate double-sided buckle. That made printing the tumor easier, and it would be really easy to replace the buckle if it broke. And with that, I was finally ready to start printing!

# Printing

This was more difficult than it should have been. If you've read my post on my 3D printer, I said it's almost always been dependable. However this was the exception. I had a number of problems during the print that took quite some effort to fix. I'll got to those later, the first step was slicing the model for the printer (again, not to be confused with 3D Slicer, the program I used to create the model).

I loaded the model, enabled support material, and hit the slice button. It took a couple minutes, but it eventually created the G-code. It just barely fit on my print bed at 100% scale too, so I was happy with that!

![Sliced brain model preview](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-sliced_orig.png)

I took a careful look at the preview to make sure everything looked good. Once I was happy, I looked at the estimated print time:

![Estimated print time of 38 hours](https://www.dryw.xyz/uploads/1/3/8/9/138986771/print-time_orig.png)

Oh. That's 38 hours.

The longest print I've ever done before is 12 hours, so this would be a new personal record! I exporte the G-code and got my printer set up. And that's when the issues started.

I went to load the filament, when I discovered there was something clogging the extruder. I couldn't easily fix it, so I had to disassemble the entire extruder just to clear it. Ugh...

![Disassembled extruder](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/extruder-disassembled.png?1645681192)

It looked like a piece of filament had just fallen into the extruder and got stuck inside the heat sink. As I started putting the extruder back together, I managed to drop the heat sink onto my power supply, which caused its fan to stop spinning. Ugh...

I took it apart and got to the circuit board of the fan. It's pretty simple, just the coil windings, a resistor, and a black chip. And somehow when the heat sink hit the power supply, it caused the resistor to come loose! It's a surface mount resistor, there should be no way for mechanical shock to cause that to come loose! How do you make such a bad solder connection? Anyways, I resoldered the resistor, and the fan worked fine afterwards.

![Power supply fan circuit board](https://www.dryw.xyz/uploads/1/3/8/9/138986771/psu-fan_orig.jpg)

With those issues fixed, I could finally start printing! And I immediately ran into another issue: the MINTEMP error. Anyone who owns a 3D printer can tell you that's a dangerous error to see. That error occurs when the measured nozzle temperature doesn't match the target temperature, and is usually a sign that the heating element or temperature sensor has come loose. Without an accurate temperature measurement, this can lead to a fire. Fortunately this safety feature is built into the firmware to prevent that from happening.

I fiddled with the temperature sensor for a while, but that didn't seem to be the problem. It appeared to be an issue with the heater, because it was actually getting cold when MINTEMP triggered. I made sure it was securely clamped in the heater block, but it was still having issues. I suspected one of the wire must have been loose, so I just replaced the heater. That seemed to fix it!

​And with that, it was finally printing! It was about 2am by this point, so I went to bed.

![Brain print starting](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-print-start_orig.jpg)

I woke up about 5 hours later to discover that it had stopped printing. Ugh...

![Failed brain print](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-print-fail-1_orig.jpg)

Interestingly, it was not a MINTEMP error that caused it to stop. The communication between the printer and OctoPrint failed. I figured the printer was working on a very detailed part of the perimeter, and the serial communication wasn't fast enough to keep up due to how many G-code commands had to be processed. This is easily fixed by the Resolution setting in PrusaSlicer. It's found under the Advanced->Slicing settings, and requires Expert mode to view and change.

The Resolution setting is used to simplify the geometry of the model. The main purpose of this feature is to speed up slicing time, however I could also use it to reduce the G-code density. I set it to 0.1mm, which caused no visible difference, but the G-code file reduced from 70MB to 43MB.

Now, I could have restarted the print, but I realized I could actually resume printing from where it was. The bed was still hot, so it the part was still stuck to it. And because the printer was still powered, it still knew where the extruder was located. This would save both time and filament, both of which I didn't have much to spare. All I had to do was find where it left off in the G-code file, delete everything before that point, then just resume sending G-code from there.

I did all that, and surprisingly, it actually worked! And then it promptly stopped printing again. Ugh...

Ok, changing the resolution may not have actually fixed the problem. But this time I was watching while it occured, and I figured out what the actual problem was. Every time the printer receives a G-code command, the printer sends back an acknowledgment to OctoPrint. If an acknowledgement isn't received, OctoPrint tries to send the command again. If an acknowledgement isn't returned for several commands in a row, OctoPrint assumes communication with the printer is lost and gives up. And that's exactly what happened.

I suspected the communication was just intermittent, and that it was actually working fine most of the time. OctoPrint has a "Fake Acknowledgement" feature that makes it keep sending G-code anyways. When I tried that, the printer kept on printing without problems, so I figured this would only be an occasional problem.

However it kept occuring, and I was getting quite annoyed with constantly clicking the Fake Acknowledgement button. So I set up a macro on my mouse to periodically click the button while I hung out nearby. Everything went fine for a few hours, but then the printer stopped again. Ugh...

I looked at the log file from OctoPrint, and saw this:

![OctoPrint log showing repeated communication errors](https://www.dryw.xyz/uploads/1/3/8/9/138986771/octoprint-log-stuck_orig.png)

To summarize, it was around line 38530 of the G-code. The printer hadn't received line 38530 correctly, so it requested OctoPrint to send it again. So OctoPrint resent that line, followed by the next couple lines. The then printer complained that the G-code lines were sent out of order, so it requested line 38530 again. OctoPrint sent it again, followed by the next couple lines. The printer then complained about a checksum being incorrect, so it requested line 38530 again. This actually occurred a total of 17 times (I cut off the log above) before OctoPrint gave up and assumed the communication was stuck.

I tried resuming the print a few more times, but kept running into the same error (at different lines). So there was definitely a problem with the serial communication between the printer and OctoPrint. My printer has an SD card slot, so I decided to try that out. But there was one small problem, the LCD was showing random characters, meaning I couldn't even tell it to start printing. Ugh...

![LCD showing random garbled characters](https://www.dryw.xyz/uploads/1/3/8/9/138986771/lcd-random_orig.png)

The only way I could fix this was by rebooting the printer. I was really hesitant to do so, because the stepper motors would lose their position, and the part could come off the bed if it cooled down too much. I realized I could write down the location that was reported by OctoPrint, and just tell the printer of its location once it rebooted. As for the bed cooling down, I just had to be fast about telling it to maintain temperature.

Somehow I managed to do all that and resume the print. Of course, I still had to delete the first part of the G-code so it would resume in the right place, which was always tricky to figure out. But it worked fine for a few more hours! Until it failed again. Ugh...

Somehow when the printer was grabbing the G-code off the SD card, it failed to grab the G from the start of the line, resulting in this error message: Unknown command: "1 X77.089 Y141.751 E0.00168". I looked at that line of the G-code, and it definitely had a G at the start, so I could only assume there was a persistent communication issue of some kind.

That was supported by the fact that the LCD was going crazy. The SD card and LCD are both connected to the main board by the same cable, so it's reasonable to assume they were related problems. I tried resuming the print a few times, but kept having the same problem. On top of that, somehow all my settings on the printer got deleted! One of which was the Z probe offset, so the printer was printing about 1mm too high during one of these resume attempts. Ugh...

​I realized I had one other way of printing: a USB connection to my computer. I previously disregarded it because I couldn't get it to connect at all, but I realized that was actually caused by disabling USB on the printer for OctoPrint. So I resumed the print again with Pronterface. And it worked fine for a few hours, at which point I had to go to bed.

​I'd been working on the printer all day, diagnosing and fixing problems, trying different solutions, all while constantly having to resume the print by editing the G-code file. The printer hadn't even gotten much further than when I found it in the morning, so I was really happy to find it still printing when I woke up the next morning!

![Brain printing continuing overnight](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-printing_orig.png)

Somehow it managed to keep printing all day without any problems. By the time I went to bed again, it had just a few hours left, so it would finish in the middle of the night. I woke up to find it had successfully finished!

![Finished brain print](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-finished_orig.jpg)

Finally! Not only was that the longest print I've ever done, it was also the most stressful by far! On top of that, it was my brother's birthday! I wasn't able to gift it to him that day, but I at least wanted to reveal it to him, so I needed to finish the rest of it quickly. That began with printing out the tumor, which was fortunately only a 3 hour print. And USB was being very reliable, there were no problems during printing!

![Finished tumor print](https://www.dryw.xyz/uploads/1/3/8/9/138986771/tumor-finished_orig.jpg)

While that was printing, I removed all the supports from the brain and made quite a mess on my desk!

![Removing supports from the brain print](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-supports-removed_orig.jpg)

The big chunk on the bottom came off in one piece, which was super satisfying. The rest of it was a lot more tedious, as there was a lot of support material between all the macaroni. Took me a few hours, but I managed to remove it all. I discovered there were some visible artifacts near the bottom when I resumed the print each time. I had to home the XY axes multiple times, which doesn't always get the exact same position each time. Plus there were some layers that got printed multiple times, which resulted in those layers being thicker and leaving a band around the perimeter. But these were all at the bottom of the print, so they're not super visible. On top of that, I was basically out of filament and time, no way I could print another one!

![Nearly empty spool of pink filament](https://www.dryw.xyz/uploads/1/3/8/9/138986771/published/pink-filament.jpg?1645690251)

The last step was to print out the buckle, and then it was finally done!

![Brain, tumor, and buckle pieces](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-buckle-tumor_orig.jpg)

And these parts snapped together really well, I couldn't have asked for a better fit!

![Fully assembled brain and tumor model](https://www.dryw.xyz/uploads/1/3/8/9/138986771/brain-assembled_orig.jpg)

I gave it to my brother the next time I saw him, he was certainly happy with it! He showed it to his doctors, who thought it was really cool. They also commented that something like it would be incredibly useful for the planning stages of surgery, and I can see why! Makes me wonder why they don't create 3D models like this for surgeons.
