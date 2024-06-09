1. test if the remote image works

    - so build locally - done
    - push to remote repo - done
    - run with prod.yml - i'm not sure about this one

2. if it works, build one singular deploy script -- push this down to last

3. setup github actions

    - it should build everything and see if it works - done
    - add space for tests (soon) - soon
    - build the buymezobo and push to docker hub
    - write a script that will pull sijirama/buymezobo and re run the repo
    - test the script on my system -- it works too, dev actually works too, it's funny
    - test it works -- it does
    - do the same for socketserver ---- we are gonna fashi this and build it on the server

4. create a prod env and test it properly that it works
    - test prod.yml works -- it works perfectly on pathfinder
    - use script to clone repo fetch new repo and run it

-------------------------------- june 9 - siji

1. fix bugs, other users can delete posts -- done
2. add comments to imges
3. add more fields to images 
4. image picture not rndereing in some places -- done
5. fix the image uploader -- doing
