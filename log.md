# todo

-   these are noticeable errors.
-   these aren't new features, just ones that we need to work on before i think we have an mvp, very simple tasks are here, after workin on one, just commit with your name and hashtag in front of it, e.g

0. get a girlfriend - #francis

1. when users first go the site, the header and landing page cta button don't resolve between logged or not logged in, this is obviously an issue from the state as both components are in different locations, and the only thing, which is also the center of this issue is the user state

2. navigation to gallery keeps crashing and then redirect back to dashboard, but then it will work on the next navigation or refresh

3. this is a minor issue, but a lot of places have plural words when there's only 1 count of the object, e.g commensts of the articles in article card

4. let's make all text text-sm for laptop and higher and text xs for mobile, there might be alot on info on the screen, it's very good we make asmuch space as possible in an aesthetic manner, the user interface is as important as possible

5. no home button on userheader for when to go home or something and no search creators navigation on drop down too or user button

6. sidebar naviagation on dashboard on mobile padding to large, and the text is even too large imo

7. all text-to text sm on large screens and text-xs on mobile

8. new articles page is weird, 1. there should be a primary button to publish the article then a dropdown beside it to publish it as a draft, aslo the space between the side of the editor and the screen is too large, this is probably margin on the editor or padding of the container

9. fix all upload file components, they're all ugly af

10. some buttons are too large on mobile, it's weird, e.g the button in payout page when you haven't set your bank info

11. for settings page, change the password settings to be in account, next in the code split the tabs to different files, like username page, makes the code too hard to read and even discouraging to read, add a systems tab, so that we can create a platform for the creator to do things like set theme color, set how much 1 zobo is for them, the default will be 250 though

12. in alot of placces the browser automatically fills the password tab, i don't think this is correc

13. set the new logo

14. make the loader the logo

15. create new branch for stage and release, and then set prod to release (siji)

16. so many place have literal "loading..." for loading state, like the text itself, we need to change that

17. userbutton icons to not fill and reduce size, also reduce text size, style the userbutton, add more options, e.g share, etc, idk

18. esit comments in articles, and suport history

19. change article to draft, right from article card dropdown, (just a put req to change type to status)

20. support history can see anonymous supports still

21. floating buycard window

22. pop up button settings

23. follow follower is kinda broken

24. open a port for prisma studio, current admin, can we add auth to the prisma studio

25. clean the user interface, a bunch of texts have weird coloring and stuff, and size and idk, ui stuff ingeneral

26. make the repo private

27. security measures for apis idk

28. calculate how much we are gonna be spending

29. landing pge text to large on mobile

30. landing page sheet is ugly af, add something to that

31. test if the remote image works

32. honestly, we have to do some code restructuring, some things are not where they are meant to be

33. also component renaming, the person that does 32 has to do this one to, because then you have to change it everywhere too

34. get keys hopefully and then test payout stuff

35. i made a model for revenue, so we have to create a revenue object when a support is made

36. payout information in payout page and some =, like 5 in dashboard earning page

37. favicon

38. better metadata for pages, the metadata for pages are weird af, we need to make them more descriptive and better

39. we need to do SEO so bad, that when people search zobo, they see our site pop, we need to make the sign in, sign up, about and faq show up too, the person that does this will probably have to also do the metadata task (task 38)

    - https://www.reddit.com/r/smallbusiness/comments/uv7wce/comment/i9kj0lg/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    - https://www.reddit.com/r/smallbusiness/comments/uv7wce/comment/i9jvf6v/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    - https://www.reddit.com/r/smallbusiness/comments/uv7wce/comment/i9juyzu/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    - https://www.reddit.com/r/smallbusiness/comments/uv7wce/comment/i9k018l/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    - https://www.reddit.com/r/smallbusiness/comments/uv7wce/comment/i9km0y5/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    - according to this seo notes, we need to make sure our pages show up, especially in nigeria, so we have to use keywords to target nigerians,

40. keywords to target nigerians searching, zobo, buy, content creators in nigeria, idk etc

41. optimizations

42. there are alot of console.log stuff everywhere, we have to remove that for prod, we can extend console.log, error, table to check if it the env is in test before printing

43. for articles to be hidden in draft and only the author can see it, we have to do some vefication in the page, if any user get's the id of the user and then adds it to the url bar, we have to check - is this the author of the article, if it is we show some extra features like edit, hange to draft and vice versa - we also have to check if it's a draft, if it is, we drop a notfound page there, preferrable from a notfound page for nextjs, and then the user can route back to where he came from, that'll be nice.

44. the options in the username page header sectoin do nothing, the settings icon should route to /settings and the options should drop a dropdown with more options e.g share, report

45. some social media icons on the about card are not impelemented

46. the landing page needs a revamp, with change of sub heading (leave the rotating words pls), but with proper keywords to attract users, ideally revamp should be done by francis and provision for keywords should be by sammy boy

47. we need a privacy page like https://buymeacoffee.com/privacy-policy

48. we need a terms page like https://buymeacoffee.com/terms

49. we need a good footer for the marketing pages

50. we need to fix the loader and custom error pages, it's ass, ass af.

51. the server tends to crash sometimes, we have to find out why

---

    - so build locally - done
    - push to remote repo - done
    - run with prod.yml - i'm not sure about this one - done

32. if it works, build one singular deploy script -- push this down to last - done

33. setup github actions

    -   it should build everything and see if it works - done
    -   add space for tests (soon) - soon
    -   build the buymezobo and push to docker hub -done
    -   write a script that will pull sijirama/buymezobo and re run the repo - done (deploy.sh)
    -   test the script on my system -- it works too, dev actually works too, it's funny
    -   test it works -- it does
    -   do the same for socketserver ---- we are gonna fashi this and build it on the server

34. create a prod env and test it properly that it works
    -   test prod.yml works -- it works perfectly on pathfinder
    -   use script to clone repo fetch new repo and run it - done

---

# june 9 - siji

1. fix bugs, other users can delete posts -- done
2. add comments to imges - v2
3. add more fields to images - v2
4. image picture not rndereing in some places -- done
5. fix the image uploader -- doing (alomst done i guess)

6. invalidate supports after new support has been made -- done

-   [ ] compliance form, make it work i guess, get good keys
-   [ ] work on payout model and payout history
-   [ ] change the cashout method to full cashout, this is not a banking app
-   [ ] your firebase keys bro

# concerning articles

/article/edit/[id] --done
/article/[id] --- done
/articles --done

# 13 and 14 june

paginate articles in both places
article page revision -- done this
views ---- no more doing views, it's irrelevant
comments -- done this

# 21 June , your changing of getCreatorPosts was good, but it fucked shit up, convert it to api

# next

1. create cron to automatically back db

2. create admin and status, someone can do admin but siji does status and uptime pages

3. real time messaging, we need to calculate how much we might have to pay firebase, as we are gonna use their firestorage and realtime messaging services, we might as well use other of their features e.g analytics etc

4. explorer page
