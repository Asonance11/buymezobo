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
    - test the script on my system
    - test it works
    - do the same for socketserver

4. create a prod env and test it properly that it works
    - test prod.yml works
    - use script to clone repo fetch new repo and run it
